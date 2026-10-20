// Checks the package as it will be published: builds it, packs the tarball, installs that into a fresh app outside
// the workspace (./app), then type-checks the app (global component types included), builds it and renders it on the
// server. Run before every release; CI runs it on every push.  npm run test:package
import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const here = fileURLToPath(new URL('.', import.meta.url));
const run = (cmd, args, cwd) =>
  execFileSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, npm_config_audit: 'false', npm_config_fund: 'false' },
  });
// The app gets the same tool versions the repo uses, so a pass here means the same thing everywhere.
const installed = (name) => JSON.parse(readFileSync(join(root, 'node_modules', name, 'package.json'), 'utf8')).version;

const work = mkdtempSync(join(tmpdir(), 'quiet-package-check-'));
try {
  console.log('\n› Building and packing @frederikhd/quiet');
  run('npm', ['run', 'build', '-w', '@frederikhd/quiet'], root);
  run('npm', ['pack', '-w', '@frederikhd/quiet', '--pack-destination', work], root);
  const tarball = join(
    work,
    readdirSync(work).find((f) => f.endsWith('.tgz')),
  );

  console.log('\n› Installing the tarball into a fresh app');
  const app = join(work, 'app');
  cpSync(join(here, 'app'), app, { recursive: true });
  writeFileSync(
    join(app, 'package.json'),
    JSON.stringify({ name: 'quiet-package-check', private: true, type: 'module' }, null, 2),
  );
  const tools = ['vue', 'vite', '@vitejs/plugin-vue', 'vue-tsc', 'typescript'].map((n) => `${n}@${installed(n)}`);
  run('npm', ['install', '--no-package-lock', tarball, ...tools], app);

  console.log('\n› Type-checking the app against the published types');
  run('npx', ['vue-tsc', '--noEmit'], app);

  // What supply-chain scanners (Socket) look at: the published bundle reads no environment variables (development
  // warnings go through Vue's own warn, which Vue's production build turns off) and isn't minified.
  const published = readFileSync(join(app, 'node_modules', '@frederikhd', 'quiet', 'dist', 'quiet.js'), 'utf8');
  if (/process\.env|import\.meta\.env/.test(published)) throw new Error('dist/quiet.js reads environment variables');
  if (!published.includes('function warnOnce(')) throw new Error('dist/quiet.js looks minified: its names are gone');

  console.log('\n› Building the app');
  run('npx', ['vite', 'build', '--logLevel', 'warn'], app);
  // Left in, process.env would throw "process is not defined" in the browser.
  const assets = join(app, 'dist', 'assets');
  for (const f of readdirSync(assets).filter((n) => n.endsWith('.js'))) {
    const js = readFileSync(join(assets, f), 'utf8');
    if (js.includes('process.env'))
      throw new Error(`${f} still contains process.env: the app's bundler didn't resolve it`);
  }

  console.log('\n› Rendering on the server');
  run('node', ['ssr.mjs'], app);

  console.log('\n✓ The package installs, type-checks, builds and renders.');
} finally {
  rmSync(work, { recursive: true, force: true });
}
