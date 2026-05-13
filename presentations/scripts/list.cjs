const fs   = require('fs');
const path = require('path');

const root      = path.join(__dirname, '..');
const slidesDir = path.join(root, 'slides');
const outputDir = path.join(root, 'output');

function findMdFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(findMdFiles(full));
    } else if (entry.name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

function parseFrontmatter(content) {
  content = content.replace(/\r\n/g, '\n');
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  match[1].split('\n').forEach(line => {
    const m = line.match(/^(\w+):\s*"?(.+?)"?\s*$/);
    if (m) fm[m[1]] = m[2].trim();
  });
  return fm;
}

function hasOutput(rel) {
  const pdfPath  = path.join(outputDir, rel + '.pdf');
  const pptxPath = path.join(outputDir, rel + '.pptx');
  const htmlPath = path.join(outputDir, rel, 'index.html');
  const exports  = [];
  if (fs.existsSync(pdfPath))  exports.push('PDF');
  if (fs.existsSync(pptxPath)) exports.push('PPTX');
  if (fs.existsSync(htmlPath)) exports.push('HTML');
  return exports;
}

const files = findMdFiles(slidesDir);

if (files.length === 0) {
  console.log('\n  No presentations found in slides/\n');
  process.exit(0);
}

const LINE = '─'.repeat(65);
console.log(`\n📋  Presentations  (${files.length} total)\n${LINE}`);

for (const file of files) {
  const rel     = path.relative(slidesDir, file).replace(/\\/g, '/').replace(/\.md$/, '');
  const content = fs.readFileSync(file, 'utf8');
  const fm      = parseFrontmatter(content);
  const subject = fm.subject || fm.title || '(no subject)';
  const author  = fm.author  || '';
  const date    = fm.date    || '';
  const theme   = fm.theme   || 'default';
  const exports = hasOutput(rel);

  console.log(`\n  📄  ${rel}`);
  console.log(`      Subject : ${subject}`);
  if (author) console.log(`      Author  : ${author}`);
  if (date)   console.log(`      Date    : ${date}`);
  console.log(`      Theme   : ${theme}`);
  if (exports.length) {
    console.log(`      Exports : ${exports.join('  ·  ')}`);
  }
}

console.log(`\n${LINE}\n`);