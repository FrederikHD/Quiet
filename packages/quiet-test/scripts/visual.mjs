// Runs the screenshot tests in the Playwright Docker image that CI uses, so results and new baselines match CI pixel
// for pixel whatever machine runs them. The image's version is the installed @playwright/test's. Dependencies are
// installed inside the container (into a Docker volume, not your node_modules), since native packages differ per
// platform. Extra arguments go to Playwright: `--update-snapshots` accepts new baselines.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../../..');
const { version } = JSON.parse(readFileSync(resolve(root, 'node_modules/@playwright/test/package.json'), 'utf8'));
const owner = process.getuid ? `${process.getuid()}:${process.getgid()}` : '';
// Behind a proxy that re-signs TLS, npm in the container needs the same extra certificates as on the host.
const ca = process.env.NODE_EXTRA_CA_CERTS;
const caArgs = ca ? ['-v', `${ca}:/extra-ca.crt:ro`, '-e', 'NODE_EXTRA_CA_CERTS=/extra-ca.crt'] : [];
const args = process.argv.slice(2).map((a) => `'${a.replace(/'/g, `'\\''`)}'`);
const script = [
  'npm ci --no-audit --no-fund --loglevel=error',
  `cd packages/quiet-test && npx playwright test --project=visual ${args.join(' ')}; s=$?`,
  // The container runs as root; hand what it wrote back to you.
  owner && `chown -R ${owner} e2e/__screenshots__ test-results playwright-report 2>/dev/null`,
  'exit $s',
]
  .filter(Boolean)
  .join('\n');

const { status } = spawnSync(
  'docker',
  [
    'run',
    '--rm',
    '--ipc=host',
    '--network=host',
    ...['-v', `${root}:/work`, '-v', 'quiet-visual-node-modules:/work/node_modules', '-w', '/work'],
    ...caArgs,
    ...['-e', 'CI', '-e', 'HTTPS_PROXY', '-e', 'HTTP_PROXY', '-e', 'NO_PROXY'],
    `mcr.microsoft.com/playwright:v${version}-noble`,
    'sh',
    '-c',
    script,
  ],
  { stdio: 'inherit' },
);
process.exit(status ?? 1);
