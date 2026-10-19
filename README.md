# Quiet

A calm, neutral-first design system for commerce — storefront and back office — built with Vue 3.

**Explorer:** https://frederikhd.github.io/Quiet/

## Packages

| Package | What it is |
| --- | --- |
| [`packages/quiet`](packages/quiet) | The library: 49 components, design tokens, styles, the `Quiet` plugin and formatting helpers. |
| [`packages/quiet-explorer`](packages/quiet-explorer) | The documentation app: brand book, tokens, icons, and for every component its guidelines, API tables, examples and a live playground. |
| [`packages/quiet-test`](packages/quiet-test) | Unit tests (Vitest + Vue Test Utils) and browser tests (Playwright): end-to-end, keyboard, accessibility (axe), responsive and visual. |

## Getting started

```sh
npm install
npm run dev        # the explorer on http://localhost:5173, running on the library's source
```

Edit a component in `packages/quiet/src/components/<Name>/` and the explorer updates, API tables included.

## Commands

| Command | Does |
| --- | --- |
| `npm run dev` | Starts the explorer. |
| `npm run build` | Builds the library (`dist/quiet.js`, `dist/quiet.css`, types) and the explorer. |
| `npm run typecheck` | Type-checks the library and the explorer with `vue-tsc`. |
| `npm run tokens` | Regenerates `tokens.css` from `tokens.json`. |
| `npm run test:unit` | Component and library tests in jsdom (fast; run them while you work). |
| `npm run test:e2e` | Builds the explorer and runs every Playwright spec against it. |
| `npm run test:visual` | Screenshot comparison of every example, light and dark, against the baselines in `packages/quiet-test/e2e/__screenshots__/<platform>/`. After a deliberate change, `npm run test:visual:update -w quiet-test` accepts the new look; review the changed images in the diff. |
| `npm test` | Unit, then end-to-end tests. |

Playwright needs a Chromium: run `npx playwright install chromium` once, or point `PW_CHROMIUM_PATH` at one you have.

## Using the library

```ts
import { createApp } from 'vue';
import { Quiet } from '@frederikhd/quiet';
import '@frederikhd/quiet/style.css';

createApp(App).use(Quiet, { locale: 'de-DE', currency: 'EUR' }).mount('#app');
```

`app.use(Quiet)` registers every component globally (add `"types": ["@frederikhd/quiet/global"]` to your tsconfig for template types).
Pass `{ components: false }` to import them one by one instead: `import { QButton } from '@frederikhd/quiet'`.

Load Inter from Google Fonts and set `data-theme="light|dark"` and `data-density="comfortable|compact"` on `<html>`.

## How the code is organised

```
packages/quiet/src/
  components/<Name>/   Q<Name>.vue, index.ts, style.css, README.md (the guidelines the explorer shows)
  components.ts        the public export list, grouped; the explorer's navigation follows its // Group comments
  internal/            building blocks shared by components (popover panel, field messages, choice rows)
  composables/         useQuietId, useFormReset, useStickyPad, useMediaQuery, useResizeObserver
  styles/              tokens.css (generated), density, base, and index.css importing every component's styles in cascade order
  config.ts            locale, currency and UI strings (configure / useConfig)
```

Conventions: `v-model` for every value (`v-model:open`, `v-model:sort`, `v-model:page` …), emits instead of callback
props, slots instead of render props, and class names shared with the original design (`q-btn`, `q-field` …).

## Adding a component

1. Create `packages/quiet/src/components/<Name>/` with `Q<Name>.vue`, `index.ts`, `style.css` and `README.md`.
2. Export it from `src/components.ts` under its group, import its `style.css` in `src/styles/index.css`,
   and add it to `src/global-components.d.ts`.
3. Add examples in `packages/quiet-explorer/src/examples/<Name>/01-Title.vue` and a playground story in
   `packages/quiet-explorer/src/stories/<Name>.story.ts`.
4. Add `packages/quiet-test/unit/<Name>.spec.ts`. The browser tests pick the new component up by themselves.

## Deploying the explorer

`.github/workflows/pages.yml` builds the explorer and publishes it to GitHub Pages on every push to `main` and
`develop`, or by hand from the Actions tab.
In the repository settings, Pages → Source must be "GitHub Actions".
