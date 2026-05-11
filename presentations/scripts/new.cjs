const fs   = require('fs');
const path = require('path');

const slideName = process.argv[2]?.trim();

if (!slideName) {
  console.error('❌  Usage: task new -- my-talk  OR  task new -- subfolder/my-talk');
  process.exit(1);
}

const root     = path.join(__dirname, '..');
const destPath = path.join(root, 'slides', slideName + '.md');
const destDir  = path.dirname(destPath);
const template = path.join(root, 'template.md');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log(`📁  Created folder: ${destDir}`);
}

if (fs.existsSync(destPath)) {
  console.error(`❌  Already exists: ${destPath}`);
  process.exit(1);
}

fs.copyFileSync(template, destPath);
console.log(`✅  Created: ${destPath}`);