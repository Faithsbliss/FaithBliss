import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const sourceDir = path.join(projectRoot, 'src (1)', 'prerender');
const outDir = path.join(projectRoot, 'dist');

if (!fs.existsSync(sourceDir)) {
  console.log('No prerender source directory found, skipping prerender build.');
  process.exit(0);
}

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Prerender source detected. No-op build completed successfully.');
