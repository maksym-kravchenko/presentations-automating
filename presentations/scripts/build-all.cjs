const fs            = require('fs');
const path          = require('path');
const { execSync }  = require('child_process');

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

const files = findMdFiles(slidesDir);

if (files.length === 0) {
  console.log('No .md files found in slides/');
  process.exit(0);
}

for (const file of files) {
  const rel    = path.relative(slidesDir, file).replace(/\\/g, '/').replace(/\.md$/, '');
  const outDir = path.join(outputDir, ...rel.split('/'));
  console.log(`\n🔨  Building: ${rel}`);
  execSync(`node scripts/inject.cjs ${rel}`,                                       { cwd: root, stdio: 'inherit' });
  execSync(`pnpm slidev build slides/${rel}.md --out ${outDir}`,                   { cwd: root, stdio: 'inherit' });
}

console.log('\n✅  All done!');