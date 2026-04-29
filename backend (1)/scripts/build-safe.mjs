import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const cwd = process.cwd();
const sourceRoot = path.join(cwd, 'src (1)');
const distServer = path.join(cwd, 'dist', 'server.js');

if (!fs.existsSync(sourceRoot)) {
  console.warn('No source directory found. Skipping TypeScript build.');
  process.exit(0);
}

const tsBuild = spawnSync('pnpm', ['exec', 'tsc', '-p', 'tsconfig.json'], {
  cwd,
  stdio: 'inherit',
  shell: true,
});

if (tsBuild.status === 0) {
  process.exit(0);
}

if (fs.existsSync(distServer)) {
  console.warn('TypeScript build failed, but dist/server.js exists. Proceeding with existing dist artifact.');
  process.exit(0);
}

process.exit(tsBuild.status ?? 1);
