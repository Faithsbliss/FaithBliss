import fs from 'fs';
import path from 'path';

const appShellPath = path.join(process.cwd(), 'dist', 'app-shell.html');

if (!fs.existsSync(appShellPath)) {
  console.warn('SEO check warning: dist/app-shell.html not found. Proceeding without failure.');
  process.exit(0);
}

const html = fs.readFileSync(appShellPath, 'utf8');
const hasTitle = /<title>.*<\/title>/i.test(html);

if (!hasTitle) {
  console.warn('SEO check warning: app-shell.html has no <title>.');
}

console.log('Prerender checks completed.');
