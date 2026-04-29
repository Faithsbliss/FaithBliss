import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const cwd = process.cwd();
const sourceRoot = path.join(cwd, 'src (1)');
const distDir = path.join(cwd, 'dist');

const entryPoint = path.join(sourceRoot, 'main.tsx');
const hasTsSources = fs.existsSync(entryPoint);

if (!hasTsSources) {
  console.warn('No TypeScript sources found in src (1). Skipping TypeScript compile step.');
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
  process.exit(0);
}

const tscBuild = spawnSync('pnpm', ['exec', 'tsc', '-b', 'tsconfig.json'], {
  cwd,
  stdio: 'inherit',
  shell: true,
});

if (tscBuild.status !== 0) process.exit(tscBuild.status ?? 1);
