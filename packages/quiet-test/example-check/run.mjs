// Checks the example shop (examples/shop) as an adopter's app: builds and packs @frederikhd/quiet, installs the
// tarball into the shop over the npm version, type-checks it, prerenders every page with Nuxt (server rendering,
// English and German), then opens the pages in Chromium: axe in both themes, no console errors (a hydration
// mismatch is one), the language of each page, and buying a shirt in German from the product page to the order.
//   npm run test:example                       build and check
//   npm run test:example -- --from-npm         check the shop with the version from its package.json, as published
//   npm run test:example -- --build-only --out site/example --base /Quiet/example/   build for GitHub Pages
import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const { values: opts } = parseArgs({
  options: {
    base: { type: 'string', default: '/Quiet/example/' },
    out: { type: 'string' },
    'build-only': { type: 'boolean', default: false },
    'from-npm': { type: 'boolean', default: false },
  },
});
const root = fileURLToPath(new URL('../../../', import.meta.url));
const shop = join(root, 'examples', 'shop');
const run = (cmd, args, cwd, env = {}) =>
  execFileSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, npm_config_audit: 'false', npm_config_fund: 'false', ...env },
  });

const work = mkdtempSync(join(tmpdir(), 'quiet-example-check-'));
let server;
try {
  if (opts['from-npm']) {
    console.log('\n› Installing the shop, with @frederikhd/quiet from npm');
    run('npm', ['ci'], shop);
  } else {
    console.log('\n› Building and packing @frederikhd/quiet');
    run('npm', ['run', 'build', '-w', '@frederikhd/quiet'], root);
    run('npm', ['pack', '-w', '@frederikhd/quiet', '--pack-destination', work], root);
    const tarball = join(
      work,
      readdirSync(work).find((f) => f.endsWith('.tgz')),
    );

    console.log('\n› Installing the shop, with this checkout of the library in place of the npm version');
    run('npm', ['ci'], shop);
    run('npm', ['install', '--no-save', tarball], shop);
  }
  const installed = JSON.parse(readFileSync(join(shop, 'node_modules/@frederikhd/quiet/package.json'), 'utf8'));
  console.log(`  @frederikhd/quiet ${installed.version}`);

  console.log('\n› Type-checking the shop');
  run('npx', ['nuxt', 'typecheck'], shop);

  console.log(`\n› Prerendering every page under ${opts.base}`);
  run('npx', ['nuxt', 'generate'], shop, { NUXT_APP_BASE_URL: opts.base });
  const site = join(shop, '.output', 'public');
  if (opts.out) {
    rmSync(join(root, opts.out), { recursive: true, force: true });
    cpSync(site, join(root, opts.out), { recursive: true, dereference: true });
    console.log(`  copied to ${opts.out}`);
  }
  if (opts['build-only']) process.exit(0);

  console.log('\n› Checking the pages in Chromium');
  server = await serve(site, opts.base);
  const failures = await check(`http://localhost:${server.address().port}${opts.base.replace(/\/$/, '')}`);
  if (failures.length) {
    console.error(`\n✗ ${failures.length} problem(s):\n  ${failures.join('\n  ')}`);
    process.exitCode = 1;
  } else console.log('\n✓ The shop builds, prerenders, hydrates and works in both languages.');
} finally {
  server?.close();
  rmSync(work, { recursive: true, force: true });
}

// The generated site at its base path, the way GitHub Pages serves it (404.html for anything missing).
function serve(dir, base) {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
  const s = createServer((req, res) => {
    const path = new URL(req.url ?? '/', 'http://localhost').pathname;
    let file = normalize(join(dir, decodeURIComponent(path.slice(base.length))));
    try {
      if (!path.startsWith(base) || !file.startsWith(dir)) throw new Error('outside');
      if (statSync(file).isDirectory()) file = join(file, 'index.html');
      res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
      res.end(readFileSync(file));
    } catch {
      res.writeHead(404, { 'content-type': 'text/html' }).end(readFileSync(join(dir, '404.html')));
    }
  });
  return new Promise((resolve) => s.listen(0, () => resolve(s)));
}

async function check(url) {
  const { chromium } = await import('playwright');
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const failures = [];
  const fail = (msg) => failures.push(msg);
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const open = async (scheme = 'light', width = 1280) => {
    const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme });
    // The web font is decoration; the check needs no network.
    await context.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ status: 200, body: '' }));
    const page = await context.newPage();
    const expected404 = () => page.url().endsWith('/nothing');
    page.on('console', (m) => {
      if (m.type() === 'error' && !expected404()) fail(`${page.url()}: console error: ${m.text()}`);
    });
    page.on('pageerror', (e) => fail(`${page.url()}: ${e.message}`));
    return page;
  };

  try {
    const pages = [
      ['/', 'en', 'Linen & Co.'],
      ['/en', 'en', 'All products'],
      ['/de', 'de', 'Alle Produkte'],
      ['/en/products/linen-shirt', 'en', 'Linen shirt'],
      ['/de/products/linen-shirt', 'de', 'Leinenhemd'],
      ['/en/cart', 'en', 'Cart'],
      ['/de/cart', 'de', 'Warenkorb'],
      ['/en/checkout', 'en', 'Check out'],
      ['/de/checkout', 'de', 'Zur Kasse'],
      ['/en/nothing', 'en', 'There’s no page here'],
    ];
    for (const scheme of ['light', 'dark']) {
      const page = await open(scheme);
      for (const [path, lang, h1] of pages) {
        await page.goto(url + path);
        await page.waitForLoadState('networkidle');
        const found = await page.evaluate(() => ({
          lang: document.documentElement.lang,
          theme: document.documentElement.dataset.theme,
          h1: [...document.querySelectorAll('h1')].map((h) => h.textContent?.trim()),
        }));
        if (found.lang !== lang) fail(`${path}: lang is "${found.lang}", not "${lang}"`);
        if (found.theme !== scheme) fail(`${path}: data-theme is "${found.theme}" with a ${scheme} system theme`);
        if (found.h1.length !== 1 || found.h1[0] !== h1) fail(`${path}: h1 is ${JSON.stringify(found.h1)}`);
        const axe = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze();
        for (const v of axe.violations)
          fail(`${path} (${scheme}): axe ${v.id} on ${v.nodes.map((n) => n.target).join(', ')}`);
      }
      await page.context().close();
    }

    // Buying a shirt in German: in-app navigation, validation, the error summary, the order.
    const page = await open();
    const step = async (name, fn) => {
      try {
        await fn();
      } catch (e) {
        fail(`German purchase, ${name}: ${e.message.split('\n')[0]}`);
        throw e;
      }
    };
    try {
      await page.goto(`${url}/de`);
      await page.evaluate(() => (window.stayed = true));
      await step('open the product', async () => {
        await page.getByRole('link', { name: 'Leinenhemd' }).first().click();
        await page.waitForURL('**/de/products/linen-shirt');
        if (!(await page.evaluate(() => window.stayed))) throw new Error('the page reloaded');
        const focused = await page.evaluate(() => document.activeElement?.textContent);
        if (focused !== 'Leinenhemd') throw new Error(`focus is on "${focused}", not the heading`);
      });
      await step('add without a size', async () => {
        await page.getByRole('button', { name: 'In den Warenkorb' }).click();
        await page.getByText('Bitte Größe wählen').waitFor({ timeout: 2000 });
      });
      await step('add size M', async () => {
        await page.getByRole('radio', { name: 'M', exact: true }).check({ force: true });
        await page.getByRole('button', { name: 'In den Warenkorb' }).click();
        await page.getByText('Leinenhemd liegt im Warenkorb').waitFor({ timeout: 2000 });
        await page.getByRole('link', { name: 'Warenkorb, 1 Artikel' }).waitFor({ timeout: 2000 });
      });
      await step('go to the cart and the checkout', async () => {
        await page.getByRole('button', { name: 'Zum Warenkorb' }).click();
        await page.waitForURL('**/de/cart');
        await page.getByRole('link', { name: 'Zur Kasse' }).click();
        await page.waitForURL('**/de/checkout');
      });
      await step('submit empty', async () => {
        await page.getByRole('button', { name: 'Zahlungspflichtig bestellen' }).click();
        const summary = page.getByRole('region', { name: 'Bitte korrigieren Sie Folgendes' });
        await summary.waitFor({ timeout: 2000 });
        if (!(await summary.evaluate((el) => el.contains(document.activeElement))))
          throw new Error('focus did not move to the error summary');
      });
      await step('fill in and order', async () => {
        await page.getByRole('textbox', { name: /E-Mail/ }).fill('anna@example.com');
        await page.getByRole('textbox', { name: /Vorname/ }).fill('Anna');
        await page.getByRole('textbox', { name: /Nachname/ }).fill('Schmidt');
        await page.getByRole('textbox', { name: /Straße/ }).fill('Lindenstraße 5');
        await page.getByRole('textbox', { name: /Postleitzahl/ }).fill('10115');
        await page.getByRole('textbox', { name: /^Ort/ }).fill('Berlin');
        await page.getByRole('checkbox', { name: /AGB/ }).check();
        await page.getByRole('button', { name: 'Zahlungspflichtig bestellen' }).click();
        await page
          .getByRole('heading', { name: 'Vielen Dank für Ihre Bestellung', level: 1 })
          .waitFor({ timeout: 2000 });
      });
      await step('switch to English on the same page', async () => {
        await page.goto(`${url}/de/products/linen-shirt`);
        await page.getByRole('link', { name: 'English' }).click();
        await page.waitForURL('**/en/products/linen-shirt');
        await page.getByRole('heading', { name: 'Linen shirt', level: 1 }).waitFor({ timeout: 2000 });
      });
    } catch {
      /* recorded by step() */
    }

    // Phones: nothing wider than the screen.
    const phone = await open('light', 375);
    for (const path of ['/en', '/de/products/linen-shirt', '/de/checkout']) {
      await phone.goto(url + path);
      await phone.waitForLoadState('networkidle');
      if (await phone.evaluate(() => document.documentElement.scrollWidth > innerWidth))
        fail(`${path}: wider than a 375px screen`);
    }
  } finally {
    await browser.close();
  }
  return failures;
}
