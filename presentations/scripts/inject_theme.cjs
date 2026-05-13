const fs = require('fs');
const path = require('path');

const slideName = process.argv[2]?.trim();
const theme = process.argv[3]?.trim();

if (!slideName) {
  console.error('❌  Usage: node scripts/inject-theme.cjs subfolder/my-talk dark');
  process.exit(1);
}

if (!theme) {
  console.log('No theme provided. Skipping.');
  process.exit(0);
}

const root = path.join(__dirname, '..');
const slidePath = path.join(root, 'slides', slideName + '.md');

if (!fs.existsSync(slidePath)) {
  console.error(`❌  File not found: ${slidePath}`);
  process.exit(1);
}

let content = fs.readFileSync(slidePath, 'utf8').replace(/\r\n/g, '\n');

const fmRegex = /^---\n([\s\S]*?)\n---/;
const match = content.match(fmRegex);

if (!match) {
  console.error('❌  No frontmatter (---) found in the slide file');
  process.exit(1);
}

let frontmatter = match[1];

const existingTheme = /^theme:.*$/m;

if (existingTheme.test(frontmatter)) {
  frontmatter = frontmatter.replace(existingTheme, `theme: "${theme}"`);
} else {
  frontmatter += `\ntheme: "${theme}"`;
}

content = content.replace(fmRegex, `---\n${frontmatter}\n---`);

fs.writeFileSync(slidePath, content);

console.log(`✅  Theme injected into ${slidePath}`);
console.log(`   theme: ${theme}`);