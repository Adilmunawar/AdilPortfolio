import fs from 'fs';
import path from 'path';

const IGNORE_LIST = ['.git', 'node_modules', '.next', 'dist', '.vercel', 'package-lock.json', '.env'];

function generateTree(dir, prefix = '') {
  const files = fs.readdirSync(dir)
    .filter(file => !IGNORE_LIST.includes(file))
    .sort((a, b) => {
      // Directories first, then files
      const aStat = fs.statSync(path.join(dir, a)).isDirectory();
      const bStat = fs.statSync(path.join(dir, b)).isDirectory();
      return bStat - aStat || a.localeCompare(b);
    });

  let tree = '';
  files.forEach((file, index) => {
    const isLast = index === files.length - 1;
    const filePath = path.join(dir, file);
    const isDirectory = fs.statSync(filePath).isDirectory();
    
    tree += `${prefix}${isLast ? '└── ' : '├── '}${file}${isDirectory ? '/' : ''}\n`;
    
    if (isDirectory) {
      tree += generateTree(filePath, `${prefix}${isLast ? '    ' : '│   '}`);
    }
  });
  return tree;
}

const treeContent = "```text\n.\n" + generateTree(process.cwd()) + "```";
const readmePath = path.join(process.cwd(), 'README.md');
let readme = fs.readFileSync(readmePath, 'utf8');

// Replace content between markers
const regex = /[\s\S]*/;
const updatedReadme = readme.replace(regex, `\n${treeContent}\n`);

fs.writeFileSync(readmePath, updatedReadme);
console.log('✅ Architecture updated in README.md');
