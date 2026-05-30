'use strict';

const fs   = require('fs');
const path = require('path');

let marked, chromium;
try {
  ({ marked } = require('marked'));
} catch {
  console.error('❌  Missing: marked\n    Run: pnpm add -D marked');
  process.exit(1);
}
try {
  ({ chromium } = require('playwright-chromium'));
} catch {
  console.error('❌  Missing: playwright-chromium\n    Run: pnpm add -D playwright-chromium');
  process.exit(1);
}

const [,, mdPath, outPath, themeArg] = process.argv;
if (!mdPath || !outPath) {
  console.error('Usage: node scripts/doc.cjs <input.md> <output.pdf> [theme]');
  process.exit(1);
}
const theme       = themeArg || 'default';
const THEMES_DIR  = path.join(__dirname, '..', 'pdf-themes');
const themePath   = path.join(THEMES_DIR, `${theme}.html`);

if (!fs.existsSync(themePath)) {
  const available = fs.existsSync(THEMES_DIR)
    ? fs.readdirSync(THEMES_DIR).filter(f => f.endsWith('.html')).map(f => f.replace(/\.html$/, ''))
    : [];
  console.error(`❌  Theme "${theme}" not found at ${themePath}`);
  if (available.length) console.error(`    Available themes: ${available.join(', ')}`);
  process.exit(1);
}

function parseFrontmatter(text) {
  text = text.replace(/\r\n/g, '\n');
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)/);
  if (!m) return { fm: {}, body: text };
  const fm = {};
  m[1].split('\n').forEach(line => {
    const kv = line.match(/^([\w-]+)\s*:\s*"?(.+?)"?\s*$/);
    if (kv) fm[kv[1].trim()] = kv[2].trim();
  });
  return { fm, body: m[2].trim() };
}

function renderTemplate(tpl, data) {
  return tpl
    .replace(/{{#(\w+)}}([\s\S]*?){{\/\1}}/g, (_, key, body) => (data[key] ? body : ''))
    .replace(/{{(\w+)}}/g, (_, key) => (data[key] != null ? String(data[key]) : ''));
}

function makeSlugger() {
  const seen = new Map();
  return (text) => {
    const base = text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '') // drop punctuation, keep letters/digits/umlauts
      .replace(/ /g, '-');
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);
    return count ? `${base}-${count}` : base;
  };
}

(async () => {
  const raw          = fs.readFileSync(mdPath, 'utf8');
  const template     = fs.readFileSync(themePath, 'utf8');
  const { fm, body } = parseFrontmatter(raw);

  const title   = fm.title   || fm.subject || path.basename(mdPath, '.md');
  const author  = fm.author  || '';
  const date    = fm.date    || '';
  const company = fm.company || '';
  const subject = fm.subject || '';

  // A thematic break (---) directly before a heading starts that heading on a
  // new page. Other --- separators (e.g. before a plain paragraph) stay as-is.
  const paged = body.replace(
    /^---[ \t]*$\n+(?=#{1,6}[ \t])/gm,
    '<div style="page-break-before: always; break-before: page;"></div>\n\n'
  );

  marked.setOptions({ gfm: true, breaks: false });
  const slug = makeSlugger();
  marked.use({
    renderer: {
      heading(token) {
        const inner = this.parser.parseInline(token.tokens);
        return `<h${token.depth} id="${slug(token.text)}">${inner}</h${token.depth}>\n`;
      },
    },
  });
  const contentHtml = marked.parse(paged);

  const html = renderTemplate(template, {
    title,
    author,
    date,
    company,
    subject,
    showSubject: subject && subject !== title,
    contentHtml,
  });

  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const browser = await chromium.launch();
  const page    = await browser.newPage();

  // A4 viewport so cover dimensions are accurate
  await page.setViewportSize({ width: 794, height: 1123 });
  await page.setContent(html, { waitUntil: 'domcontentloaded' });

  await page.pdf({
    path:            outPath,
    format:          'A4',
    printBackground: true,
    margin: {
      top:    '22mm',
      right:  '22mm',
      bottom: '28mm',
      left:   '22mm',
    },
  });

  await browser.close();
  console.log(`✅  Document saved: ${outPath}  (theme: ${theme})`);
})();
