const fs = require('fs');
const path = require('path');

function scan(dir) {
  if (!fs.existsSync(dir)) return;
  const stat = fs.statSync(dir);
  if (stat.isFile()) {
    const ext = path.extname(dir);
    if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
      const content = fs.readFileSync(dir, 'utf8');
      if (content.includes('useProducts')) {
        console.log(`Found useProducts in: ${dir}`);
      }
    }
  } else if (stat.isDirectory()) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (item === 'node_modules' || item === '.next' || item === '.git') continue;
      scan(path.join(dir, item));
    }
  }
}

scan('./src');
