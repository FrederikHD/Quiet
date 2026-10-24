// Checks the design system's React bridge: every component's playground story is rendered straight in Vue and
// through components/bundle.js the way a claude.ai design canvas mounts it, in Chromium, and the two must give the
// same HTML, without errors. Then a few interactions run through the bridge.
//   npm run design-system:check -w quiet-test     (after npm run design-system)
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { build } from 'vite';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = fileURLToPath(new URL('../out/', import.meta.url));
const components = `${out}project/components`;
const require = createRequire(import.meta.url);
// The UMD builds, which the canvas also loads as globals (the packages don't export these paths).
const umd = (pkg, file) => `${dirname(require.resolve(`${pkg}/package.json`))}/umd/${file}`;
const reactUmd = umd('react', 'react.production.min.js');
const reactDom = umd('react-dom', 'react-dom.production.min.js');

mkdirSync(`${out}check`, { recursive: true });
await build({
  configFile: false,
  logLevel: 'warn',
  define: { 'process.env.NODE_ENV': '"production"' },
  build: {
    outDir: `${out}check`,
    emptyOutDir: true,
    minify: false,
    lib: { entry: `${here}harness.ts`, formats: ['iife'], name: 'QuietCheckPage', fileName: () => 'harness.js' },
    rollupOptions: {
      external: ['vue', '@frederikhd/quiet'],
      output: { globals: { vue: 'Quiet.__vue', '@frederikhd/quiet': 'Quiet.__lib' } },
    },
  },
});
writeFileSync(
  `${out}check/index.html`,
  `<!doctype html>
<html lang="en" data-theme="light" data-density="comfortable">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="${components}/bundle.css">
<script src="${reactUmd}"></script>
<script src="${reactDom}"></script>
<script src="${components}/bundle.js"></script>
<script src="harness.js"></script>
</head>
<body>
<div id="vue"></div>
<div id="react"></div>
</body>
</html>
`,
);

// The two renders as comparable HTML: comments, the bridge's and the canvas's display: contents wrappers and their
// markers dropped, and generated ids numbered in order of appearance, so references between elements still compare.
function normalized(root) {
  const copy = root.cloneNode(true);
  const walker = document.createTreeWalker(copy, NodeFilter.SHOW_COMMENT);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  for (const c of comments) c.remove();
  for (const el of [...copy.querySelectorAll('div, span')].reverse()) {
    if (el.getAttribute('style')?.replace(/\s/g, '') === 'display:contents;' || el.classList.contains('sc-host-x'))
      el.replaceWith(...el.childNodes);
  }
  const ids = new Map();
  const id = (t) => (ids.has(t) ? ids.get(t) : (ids.set(t, `id${ids.size}`), ids.get(t)));
  const refs = [
    'id',
    'for',
    'aria-labelledby',
    'aria-describedby',
    'aria-controls',
    'aria-activedescendant',
    'aria-owns',
    'name',
    'list',
    'form',
  ];
  for (const el of copy.querySelectorAll('*')) {
    el.removeAttribute('data-v-app');
    el.removeAttribute('data-dc-tpl');
    for (const a of refs) if (el.hasAttribute(a)) el.setAttribute(a, el.getAttribute(a).split(/\s+/).map(id).join(' '));
    const href = el.getAttribute('href');
    if (href?.startsWith('#') && href.length > 1) el.setAttribute('href', `#${id(href.slice(1))}`);
  }
  return copy.innerHTML.replace(/>\s+</g, '><').trim();
}

const firstDifference = (a, b) => {
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  return { vue: a.slice(Math.max(0, i - 120), i + 160), canvas: b.slice(Math.max(0, i - 120), i + 160) };
};

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
const problems = [];
let errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && errors.push(m.text()));
const open = async (name, model) => {
  errors = [];
  await page.goto(`file://${out}check/index.html`);
  if (model === undefined) await page.evaluate((n) => window.QuietCheck.mount(n), name);
  else await page.evaluate(([n, m]) => window.QuietCheck.mountCanvas(n, m), [name, model]);
  await page.waitForTimeout(150);
};

await page.goto(`file://${out}check/index.html`);
const names = await page.evaluate(() => window.QuietCheck.names());
for (const name of names) {
  await open(name);
  const [vue, canvas] = await page.evaluate(
    `[(${normalized})(document.getElementById('vue')), (${normalized})(document.getElementById('react'))]`,
  );
  const ok = vue === canvas && !errors.length;
  console.log(`${ok ? '✓' : '✗'} ${name}`);
  if (vue !== canvas) problems.push({ name, ...firstDifference(vue, canvas) });
  for (const e of errors) problems.push({ name, error: e.split('\n')[0] });
}

// Interactions through the bridge (the #react render), each as on a canvas.
const react = (sel) => page.locator(`#react ${sel}`);
const interactions = {
  async Checkbox() {
    await react('input[type="checkbox"]').first().click();
    if (await react('input[type="checkbox"]').first().isChecked()) throw new Error('did not toggle off');
  },
  async Input() {
    await react('input').first().fill('Linen shirt');
    if ((await react('input').first().inputValue()) !== 'Linen shirt') throw new Error('typing did not stick');
  },
  async Select() {
    const select = react('select').first();
    const values = await select.evaluate((s) => [...s.options].map((o) => o.value).filter(Boolean));
    await select.selectOption(values.at(-1));
    if ((await select.inputValue()) !== values.at(-1)) throw new Error('the choice did not stick');
  },
  async RadioGroup() {
    const radios = react('input[type="radio"]');
    await radios.nth(1).check({ force: true });
    if (!(await radios.nth(1).isChecked())) throw new Error('the choice did not stick');
  },
  async Combobox() {
    await react('button[aria-haspopup="dialog"]').first().click();
    await page.getByRole('option').first().click();
    if (!(await react('.q-combo__value').first().textContent()).trim()) throw new Error('nothing was chosen');
  },
  async DatePicker() {
    await react('input').first().fill('3.1.2027');
    await react('input').first().press('Enter');
    if (!(await react('input').first().inputValue()).includes('2027')) throw new Error('the typed date was not read');
    await react('.q-datepicker__button').click();
    await page.getByRole('dialog').getByRole('grid').waitFor({ timeout: 2000 });
  },
  async Tabs() {
    const tabs = react('[role="tab"]');
    await tabs.nth(1).click();
    if ((await tabs.nth(1).getAttribute('aria-selected')) !== 'true') throw new Error('the tab did not switch');
  },
  async Menu() {
    await react('button[aria-haspopup="menu"]').first().click();
    await page.getByRole('menu').waitFor({ timeout: 2000 });
  },
  Dialog: {
    model: true,
    async run() {
      const dialog = page.locator('[role="dialog"], [role="alertdialog"]').first();
      await dialog.waitFor({ timeout: 2000 });
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden', timeout: 2000 });
    },
  },
  async Popover() {
    const trigger = react('button[aria-label]').first();
    await trigger.click();
    if ((await trigger.getAttribute('aria-expanded')) !== 'true') throw new Error('it did not open');
  },
  async QuantityStepper() {
    const input = react('input').first();
    const before = Number(await input.inputValue());
    await react('button').last().click();
    if (Number(await input.inputValue()) !== before + 1) throw new Error('+ did not count up');
  },
  async Disclosure() {
    const button = react('button[aria-expanded]').first();
    const before = await button.getAttribute('aria-expanded');
    await button.click();
    if ((await button.getAttribute('aria-expanded')) === before) throw new Error('it did not open or close');
  },
};
for (const [name, test] of Object.entries(interactions)) {
  if (!names.includes(name)) continue;
  await open(name, test.model);
  try {
    await (test.run ?? test)();
    console.log(`✓ ${name} (interaction)`);
  } catch (e) {
    console.log(`✗ ${name} (interaction)`);
    problems.push({ name, interaction: e.message.split('\n')[0] });
  }
  for (const e of errors) problems.push({ name, error: e.split('\n')[0] });
}
await browser.close();

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(JSON.stringify(p, null, 2));
  process.exitCode = 1;
} else console.log(`\n✓ ${names.length} components render the same on a canvas as in Vue.`);
