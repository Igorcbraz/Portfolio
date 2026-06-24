const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(ROOT_DIR, 'data', 'repo-data.json');

const textExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.md', '.html', '.svg', '.mjs', '.config', '.jsonl'];

function isTextFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return textExtensions.includes(ext) || filename === 'LICENSE';
}

function shouldIgnore(name, relPath) {
  const ignoreList = [
    'node_modules',
    '.next',
    '.git',
    '.vscode',
    '.agents',
    'tsconfig.tsbuildinfo',
    'package-lock.json',
    '.env',
    'extract_lighthouse.ps1',
    '.DS_Store',
    'data/repo-data.json',
    'scripts'
  ];

  if (ignoreList.includes(name)) return true;
  if (ignoreList.includes(relPath)) return true;
  if (name.startsWith('.')) return true;
  return false;
}

const mockFiles = {};

function walk(dirPath, relPath = '') {
  const items = fs.readdirSync(dirPath);
  const children = [];

  for (const item of items) {
    const itemRelPath = relPath ? `${relPath}/${item}` : item;
    if (shouldIgnore(item, itemRelPath)) continue;

    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const folderChildren = walk(fullPath, itemRelPath);
      children.push({
        name: item,
        type: 'folder',
        children: folderChildren
      });
    } else {
      let content = '';
      if (isTextFile(item)) {
        content = fs.readFileSync(fullPath, 'utf-8');
      } else {
        const ext = path.extname(item).slice(1).toUpperCase() || 'Binary';
        content = `[Binary data: ${ext} file]`;
      }
      mockFiles[itemRelPath] = content;
      children.push({
        name: item,
        type: 'file',
        id: itemRelPath
      });
    }
  }

  children.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  return children;
}

function generate() {
  console.log('Scanning repository structure...');
  const rootChildren = walk(ROOT_DIR);

  let settingsContent = '{}';
  try {
    settingsContent = fs.readFileSync(path.join(ROOT_DIR, 'data', 'settings.json'), 'utf-8');
  } catch (e) {
    console.warn('Could not read settings.json for mocking', e);
  }

  let aboutPtContent = '{}';
  try {
    aboutPtContent = fs.readFileSync(path.join(ROOT_DIR, 'locales', 'about', 'pt.json'), 'utf-8');
  } catch (e) {
    console.warn('Could not read about pt.json for mocking', e);
  }

  const portfolioCode = `import { Hero, Journey, Projects, Stack, Contact } from "@/components/sections"

export default function Portfolio() {
  const name = "Igor Braz"
  const role = "Full Stack Developer"

  return (
    <div className="portfolio min-h-screen bg-background text-foreground">
      <Hero name={name} role={role} />
      <Journey />
      <Projects />
      <Stack />
      <Contact />
    </div>
  )
}`;

  mockFiles['portfolio.tsx'] = portfolioCode;
  mockFiles['igor.json'] = aboutPtContent;
  mockFiles['settings.json'] = settingsContent;

  rootChildren.push({
    name: 'portfolio.tsx',
    type: 'file',
    id: 'portfolio.tsx'
  });
  rootChildren.push({
    name: 'igor.json',
    type: 'file',
    id: 'igor.json'
  });
  rootChildren.push({
    name: 'settings.json',
    type: 'file',
    id: 'settings.json'
  });

  rootChildren.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  const output = {
    fileStructure: rootChildren,
    mockFiles: mockFiles
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Generated ${OUTPUT_FILE} successfully with ${Object.keys(mockFiles).length} files!`);
}

generate();
