const fs   = require('fs');
const path = require('path');

const fromName = process.argv[2]?.trim();
const toName   = process.argv[3]?.trim();

if (!fromName || !toName) {
  console.error('❌  Usage: task duplicate FROM=source TO=new-name');
  process.exit(1);
}

const root     = path.join(__dirname, '..');
const fromPath = path.join(root, 'slides', fromName + '.md');
const toPath   = path.join(root, 'slides', toName   + '.md');
const toDir    = path.dirname(toPath);

if (!fs.existsSync(fromPath)) {
  console.error(`❌  Not found: slides/${fromName}.md`);
  process.exit(1);
}

if (fs.existsSync(toPath)) {
  console.error(`❌  Already exists: slides/${toName}.md`);
  process.exit(1);
}

if (!fs.existsSync(toDir)) {
  fs.mkdirSync(toDir, { recursive: true });
  console.log(`📁  Created folder: ${toDir}`);
}

fs.copyFileSync(fromPath, toPath);
console.log(`✅  Duplicated: ${fromName}  →  ${toName}`);
console.log(`   Run 'task inject NAME=${toName}' to update config values`);