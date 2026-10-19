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
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: 'inherit', env: { ...process.env, npm_config_audit: 'false', npm_config_fund: 'false' } });
// The app gets the same tool versions the repo uses, so a pass here means the same thing everywhere.
const installed = (name) => JSON.parse(readFileSync(join(root, 'node_modules', name, 'package.json'), 'utf8')).version;

const work = mkdtempSync(join(tmpdir(), 'quiet-package-check-'));
try {
  console.log('\n› Building and packing @frederikhd/quiet');
  run('npm', ['run', 'build', '-w', '@frederikhd/quiet'], root);
  run('npm', ['pack', '-w', '@frederikhd/quiet', '--pack-destination', work], root);
  const tarball = join(work, readdirSync(work).find((f) => f.endsWith('.tgz')));

  console.log('\n› Installing the tarball into a fresh app');
  const app = join(work, 'app');
  cpSync(join(here, 'app'), app, { recursive: true });
  writeFileSync(join(app, 'package.json'), JSON.stringify({ name: 'quiet-package-check', private: true, type: 'module' }, null, 2));
  const tools = ['vue', 'vite', '@vitejs/plugin-vue', 'vue-tsc', 'typescript'].map((n) => `${n}@${installed(n)}`);
  run('npm', ['install', '--no-package-lock', tarball, ...tools], app);

  console.log('\n› Type-checking the app against the published types');
  run('npx', ['vue-tsc', '--noEmit'], app);

  console.log('\n› Building the app');
  run('npx', ['vite', 'build', '--logLevel', 'warn'], app);
  // The library's development warnings are process.env.NODE_ENV checks for the app's bundler to resolve. Left in, the
  // production bundle would throw "process is not defined" in the browser; resolved, the warnings are gone with them.
  const assets = join(app, 'dist', 'assets');
  for (const f of readdirSync(assets).filter((n) => n.endsWith('.js'))) {
    const js = readFileSync(join(assets, f), 'utf8');
    if (js.includes('process.env')) throw new Error(`${f} still contains process.env: the app's bundler didn't resolve it`);
    if (js.includes('[Quiet]')) throw new Error(`${f} still contains development warnings`);
  }

  console.log('\n› Rendering on the server');
  run('node', ['ssr.mjs'], app);

  console.log('\n✓ The package installs, type-checks, builds and renders.');
} finally {
  rmSync(work, { recursive: true, force: true });
}
