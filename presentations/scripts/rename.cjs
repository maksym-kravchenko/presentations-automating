const fs   = require('fs');
const path = require('path');

const fromName = process.argv[2]?.trim();
const toName   = process.argv[3]?.trim();

if (!fromName || !toName) {
  console.error('❌  Usage: task rename FROM=old-name TO=new-name');
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
}

fs.renameSync(fromPath, toPath);
console.log(`✅  Renamed slide:  ${fromName}  →  ${toName}`);

// Rename output folder/files if they exist
const exts = ['.pdf', '.pptx', '-editable.pptx', ''];
for (const ext of exts) {
  const fromOut = path.join(root, 'output', fromName + ext);
  const toOut   = path.join(root, 'output', toName   + ext);
  if (fs.existsSync(fromOut)) {
    const toOutDir = path.dirname(toOut);
    if (!fs.existsSync(toOutDir)) fs.mkdirSync(toOutDir, { recursive: true });
    fs.renameSync(fromOut, toOut);
    console.log(`✅  Renamed output: output/${fromName}${ext}  →  output/${toName}${ext}`);
  }
}