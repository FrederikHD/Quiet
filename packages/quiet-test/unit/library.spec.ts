// @vitest-environment node
// Library-wide checks: the plugin, the generated stylesheet, the global component types and every
// component folder's public files.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as quiet from 'quiet';
import { createApp } from 'vue';
import { describe, expect, it } from 'vitest';

const lib = fileURLToPath(new URL('../../quiet/', import.meta.url));
const exported = Object.keys(quiet).filter((n) => /^Q[A-Z]/.test(n)).sort();

describe('library', () => {
  it('app.use(Quiet) registers every Q component', () => {
    const app = createApp({});
    app.use(quiet.Quiet, { locale: 'de-DE' });
    for (const name of exported) expect(app.component(name), name).toBeDefined();
  });

  it('app.use(Quiet, { components: false }) only configures', () => {
    const app = createApp({});
    app.use(quiet.Quiet, { components: false });
    expect(app.component('QButton')).toBeUndefined();
  });

  it('declares a global type for every exported component, and nothing else', () => {
    const dts = readFileSync(`${lib}src/global-components.d.ts`, 'utf8');
    const declared = [...dts.matchAll(/^\s+(Q\w+): typeof/gm)].map((m) => m[1]).sort();
    expect(declared).toEqual(exported);
  });

  it('tokens.css is in sync with tokens.json', () => {
    expect(() => execFileSync('node', [`${lib}scripts/build-tokens.mjs`, '--check'], { stdio: 'pipe' })).not.toThrow();
  });

  it('every component folder has its component, entry and guidelines, and its styles are in the stylesheet', () => {
    const css = readFileSync(`${lib}src/styles/index.css`, 'utf8');
    const folders = readdirSync(`${lib}src/components`, { withFileTypes: true }).filter((d) => d.isDirectory());
    for (const { name } of folders) {
      const dir = `${lib}src/components/${name}`;
      for (const file of ['index.ts', 'README.md']) expect(existsSync(`${dir}/${file}`), `${name}/${file}`).toBe(true);
      expect(readdirSync(dir).some((f) => /^Q\w+\.vue$/.test(f)), `${name} has a component`).toBe(true);
      // Some share a stylesheet (Checkbox and Radio use styles/choice.css).
      if (existsSync(`${lib}src/components/${name}/style.css`)) {
        expect(css, `${name} styles imported`).toContain(`../components/${name}/style.css`);
      }
    }
  });

  it('formats money and numbers for the configured locale', () => {
    quiet.configure({ locale: 'de-DE', currency: 'EUR' });
    expect(quiet.money(19.9).replace(/\s/g, ' ')).toBe('19,90 €');
    quiet.configure({ locale: 'en-US', currency: 'USD' });
    expect(quiet.money(19.9)).toBe('$19.90');
    quiet.configure({ locale: 'de-DE', currency: 'EUR' });
  });
});

describe('server rendering', () => {
  it('renders components to HTML without a browser', async () => {
    const { renderToString } = await import('vue/server-renderer');
    const { createSSRApp, h } = await import('vue');
    const app = createSSRApp({
      render: () => [
        h(quiet.QButton, { variant: 'primary' }, () => 'Save'),
        h(quiet.QField, { label: 'Email' }, () => h(quiet.QInput)),
        h(quiet.QTable, { caption: 'Orders', columns: [{ key: 'id', header: 'Order' }], rows: [{ id: 1 }] }),
        h(quiet.QTabs, { label: 'Views', tabs: [{ value: 'a', label: 'A' }], modelValue: 'a' }),
        h(quiet.QDialog, { open: false, title: 'Hi' }),
      ],
    });
    const html = await renderToString(app);
    expect(html).toContain('q-btn--primary');
    expect(html).toContain('Orders');
  });
});
