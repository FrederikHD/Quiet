// The explorer's examples, for the design system's component previews: QuietExamples.mount(el, 'Button') shows a
// component's first examples, run on the components in bundle.js (window.Quiet).
import { createApp, h, type Component } from 'vue';
import { QToaster, configure } from '@frederikhd/quiet';
import descriptions from 'virtual:example-descriptions';

const modules = import.meta.glob<Component>('../../../quiet-explorer/src/examples/*/*.vue', {
  eager: true,
  import: 'default',
});

function examples(folder: string) {
  return Object.keys(modules)
    .filter((p) => p.split('/').at(-2) === folder)
    .sort()
    .map((p) => {
      // 01-EditForm.vue → "Edit form"
      const words = p
        .split('/')
        .pop()!
        .replace(/\.vue$/, '')
        .replace(/^\d+-/, '')
        .replace(/([a-z])([A-Z])/g, '$1 $2');
      return {
        title: words.charAt(0).toUpperCase() + words.slice(1).toLowerCase(),
        description: descriptions[p.split('/').slice(-2).join('/')],
        component: modules[p],
      };
    });
}

export function mount(el: HTMLElement, folder: string, max = 3) {
  // As the explorer shows them: a German shop in euros.
  configure({ locale: 'de-DE', currency: 'EUR' });
  const app = createApp({
    render: () =>
      h('div', { class: 'qx' }, [
        ...examples(folder)
          .slice(0, max)
          .map((x) =>
            h('section', { class: 'qx__example' }, [
              h('h2', { class: 'qx__title' }, x.title),
              x.description ? h('p', { class: 'qx__desc' }, x.description) : null,
              h('div', { class: 'qx__stage' }, [h(x.component)]),
            ]),
          ),
        h(QToaster),
      ]),
  });
  app.mount(el);
  return app;
}
