// Server rendering from the published build, with no browser globals.
import { Quiet, QAppShell, QCombobox, QDialog, QNav, QTable, QTabs } from '@frederikhd/quiet';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';

const app = createSSRApp({
  render: () =>
    h(
      QAppShell,
      { brand: 'Shop' },
      {
        nav: () => h(QNav, { items: [{ label: 'Home', href: '/' }] }),
        default: () => [
          h(QTable, { caption: 'Orders', columns: [{ key: 'id', header: 'Order' }], rows: [{ id: 1 }] }),
          h(QTabs, { label: 'Views', tabs: [{ value: 'a', label: 'A' }], modelValue: 'a' }),
          h(QCombobox, { options: [{ value: 'a', label: 'A' }], 'aria-label': 'Pick' }),
          h(QDialog, { open: false, title: 'Edit' }),
        ],
      },
    ),
});
app.use(Quiet, { locale: 'de-DE' });
const html = await renderToString(app);
if (!html.includes('q-shell') || !html.includes('Orders')) throw new Error('SSR output is missing content');
console.log(`SSR rendered ${html.length} characters`);
