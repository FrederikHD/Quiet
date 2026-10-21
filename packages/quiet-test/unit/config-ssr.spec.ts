// @vitest-environment node
// On a server, one process renders many requests at once. Each app that installs the plugin keeps its own locale,
// currency and translations, so two requests in different languages never mix, even while their rendering interleaves.
import { configure, money, Quiet, QPagination, QPrice, useConfig, type QuietPluginOptions } from '@frederikhd/quiet';
import { afterEach, describe, expect, it } from 'vitest';
import { createSSRApp, defineComponent, h } from 'vue';
import { renderToString } from 'vue/server-renderer';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// A page whose setup waits (fetching data, say) before rendering, so the two requests below render alternately.
const Page = defineComponent({
  props: { wait: { type: Number, required: true } },
  async setup(props) {
    await sleep(props.wait);
    return () => [
      h(QPrice, { amount: 1240.5 }),
      h(QPagination, { page: 2, pageSize: 25, total: 1240 }),
      h('p', { class: 'fmt' }, money(9.9)),
    ];
  },
});

const render = (options: QuietPluginOptions, wait: number) => {
  const app = createSSRApp({ render: () => h(Page, { wait }) });
  app.use(Quiet, options);
  return renderToString(app);
};

const reset = { locale: 'en', currency: 'EUR', strings: { pagination: { label: 'Pagination' } } };
afterEach(() => configure(reset));

describe('server rendering', () => {
  it('keeps each app’s locale, currency and translations while requests render at the same time', async () => {
    const [de, en] = await Promise.all([
      render({ locale: 'de-DE', currency: 'EUR', strings: { pagination: { label: 'Seitennavigation' } } }, 30),
      render({ locale: 'en-US', currency: 'USD' }, 5),
    ]);
    expect(de).toContain('1.240,50');
    expect(de).toContain('aria-label="Seitennavigation"');
    expect(de).toMatch(/9,90\s€/);
    expect(en).toContain('$1,240.50');
    expect(en).toContain('aria-label="Pagination"');
    expect(en).toContain('$9.90');
  });

  it('starts each app from the shared settings, without changing them', async () => {
    configure({ locale: 'de-DE', strings: { pagination: { label: 'Seiten' } } });
    const html = await render({ currency: 'CHF' }, 0);
    expect(html).toContain('aria-label="Seiten"');
    expect(html).toMatch(/1.240,50\sCHF/);
    expect(useConfig().currency).toBe('EUR');
    expect(money(1)).toMatch(/1,00\s€/);
  });

  it('applies configure() in a component’s setup to that app only', async () => {
    const Local = defineComponent({
      setup() {
        configure({ locale: 'fr-FR' });
        return () => h(QPrice, { amount: 1240.5 });
      },
    });
    const app = createSSRApp(Local);
    app.use(Quiet);
    expect(await renderToString(app)).toMatch(/1\s240,50\s€/);
    expect(useConfig().locale).toBe('en');
  });
});
