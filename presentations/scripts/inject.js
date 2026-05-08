const fs   = require('fs');
const path = require('path');

const slideName = process.argv[2]?.trim();

if (!slideName) {
  console.error('❌  Provide a slide name:  node scripts/inject.js my-talk');
  process.exit(1);
}

const root      = path.join(__dirname, '..');
const config    = JSON.parse(fs.readFileSync(path.join(root, 'config.json'), 'utf8'));
const slidePath = path.join(root, 'slides', `${slideName}.md`);

if (!fs.existsSync(slidePath)) {
  console.error(`❌  File not found: ${slidePath}`);
  process.exit(1);
}

let content = fs.readFileSync(slidePath, 'utf8').replace(/\r\n/g, '\n');

const fmRegex = /^---\n([\s\S]*?)\n---/;
const match   = content.match(fmRegex);

if (!match) {
  console.error('❌  No frontmatter (---) found in the slide file');
  process.exit(1);
}

let frontmatter = match[1];

Object.entries(config).forEach(([key, value]) => {
  const existing = new RegExp(`^${key}:.*$`, 'm');
  if (existing.test(frontmatter)) {
    frontmatter = frontmatter.replace(existing, `${key}: "${value}"`);
  } else {
    frontmatter += `\n${key}: "${value}"`;
  }
});

content = content.replace(fmRegex, `---\n${frontmatter}\n---`);
fs.writeFileSync(slidePath, content);

console.log(`✅  Config injected into ${slidePath}`);
Object.entries(config).forEach(([k, v]) => console.log(`   ${k}: ${v}`));