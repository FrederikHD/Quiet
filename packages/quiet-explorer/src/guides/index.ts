// Guides: how to adopt Quiet in an app, from install to upgrading. The Markdown lives with the library
// (packages/quiet/docs/guides), so it reads on GitHub too; each loads only when its page opens.

export interface Guide {
  slug: string;
  title: string;
  load: () => Promise<string>;
}

const raw = (m: { default: string }) => m.default;

export const guides: Guide[] = [
  {
    slug: 'getting-started',
    title: 'Getting started',
    load: () => import('@quiet/docs/guides/getting-started.md?raw').then(raw),
  },
  {
    slug: 'translations',
    title: 'Translations',
    // The complete German setup is a type-checked file (de.ts, checked by de.check.ts), shown in place of its marker.
    load: () =>
      Promise.all([import('@quiet/docs/guides/translations.md?raw'), import('./de.ts?raw')]).then(([md, de]) =>
        md.default.replace('<!-- de.ts -->', '```ts\n' + de.default.trimEnd() + '\n```'),
      ),
  },
  { slug: 'theming', title: 'Theming', load: () => import('@quiet/docs/guides/theming.md?raw').then(raw) },
  { slug: 'forms', title: 'Forms', load: () => import('@quiet/docs/guides/forms.md?raw').then(raw) },
  {
    slug: 'accessibility',
    title: 'Accessibility',
    load: () => import('@quiet/docs/guides/accessibility.md?raw').then(raw),
  },
  { slug: 'upgrading', title: 'Upgrading', load: () => import('@quiet/docs/guides/upgrading.md?raw').then(raw) },
];
