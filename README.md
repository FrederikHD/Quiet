# Quiet

A calm, neutral-first design system for commerce — storefront and back office — built with Vue 3.

**Explorer:** https://frederikhd.github.io/Quiet/ · **npm:** [`@frederikhd/quiet`](https://www.npmjs.com/package/@frederikhd/quiet) · MIT

## Packages

| Package                                              | What it is                                                                                                                             |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [`packages/quiet`](packages/quiet)                   | The library, published as `@frederikhd/quiet`: 49 components, design tokens, styles, the `Quiet` plugin and formatting helpers.        |
| [`packages/quiet-explorer`](packages/quiet-explorer) | The documentation app: brand book, tokens, icons, and for every component its guidelines, API tables, examples and a live playground.  |
| [`packages/quiet-test`](packages/quiet-test)         | Unit tests (Vitest + Vue Test Utils) and browser tests (Playwright): end-to-end, keyboard, accessibility (axe), responsive and visual. |

## Getting started

How to work on Quiet (branches, checks, screenshot tests, releases) is in [CONTRIBUTING.md](CONTRIBUTING.md).

```sh
npm install
npm run dev        # the explorer on http://localhost:5173, running on the library's source
```

Edit a component in `packages/quiet/src/components/<Name>/` and the explorer updates, API tables included.

## Commands

| Command                                                      | Does                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                                                | Starts the explorer.                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `npm run build`                                              | Builds the library (`dist/quiet.js`, `dist/quiet.css`, types) and the explorer.                                                                                                                                                                                                                                                                                                                                                                                            |
| `npm run lint`                                               | ESLint over everything, including accessibility rules for templates (`lint:fix` fixes what it can).                                                                                                                                                                                                                                                                                                                                                                        |
| `npm run format`                                             | Prettier over everything (`format:check` only checks, as CI does).                                                                                                                                                                                                                                                                                                                                                                                                         |
| `npm run typecheck`                                          | Type-checks the library, the explorer and the tests with `vue-tsc`.                                                                                                                                                                                                                                                                                                                                                                                                        |
| `npm run tokens`                                             | Regenerates `tokens.css` from `tokens.json`.                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `npm run test:unit`                                          | Component and library tests in jsdom (fast; run them while you work).                                                                                                                                                                                                                                                                                                                                                                                                      |
| `npm run test:e2e`                                           | Builds the explorer and runs every Playwright spec against it.                                                                                                                                                                                                                                                                                                                                                                                                             |
| `npm run test:e2e:firefox -w quiet-test` / `test:e2e:webkit` | The same e2e suite in Firefox or WebKit (Safari's engine); needs `npx playwright install firefox webkit`. CI runs all three browsers.                                                                                                                                                                                                                                                                                                                                      |
| `npm run test:visual`                                        | Screenshot comparison of every example, light and dark, against the baselines in `packages/quiet-test/e2e/__screenshots__/linux/`. Runs in the Playwright Docker image CI uses, so it needs Docker and gives the same pixels on any machine. After a deliberate change, `npm run test:visual:update -w quiet-test` accepts the new look; review the changed images in the diff. When CI's visual job fails, its `playwright-report-visual` artifact shows each difference. |
| `npm run test:package`                                       | Packs the library as it will be published, installs it into a fresh app and type-checks, builds and server-renders that app.                                                                                                                                                                                                                                                                                                                                               |
| `npm test`                                                   | Unit, then end-to-end tests.                                                                                                                                                                                                                                                                                                                                                                                                                                               |

Playwright needs a Chromium: run `npx playwright install chromium` once, or point `PW_CHROMIUM_PATH` at one you have.

## Using the library

```sh
npm install @frederikhd/quiet
```

```ts
import { createApp } from 'vue';
import { Quiet } from '@frederikhd/quiet';
import '@frederikhd/quiet/style.css';

createApp(App).use(Quiet, { locale: 'de-DE', currency: 'EUR' }).mount('#app');
```

`app.use(Quiet)` registers every component globally (add `"types": ["@frederikhd/quiet/global"]` to your tsconfig for template types).
Pass `{ components: false }` to import them one by one instead: `import { QButton } from '@frederikhd/quiet'`.

Load Inter from Google Fonts and set `data-theme="light|dark"` and `data-density="comfortable|compact"` on `<html>`.
Toasts need a `<QToaster />` (AppShell includes one). More in the [package README](packages/quiet/README.md).

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

`.github/workflows/pages.yml` builds the explorer and publishes it to GitHub Pages. The release workflow runs it after
publishing, so the site documents the version on npm, which it shows in its navigation. To redeploy without a release,
run it by hand from the Actions tab on `develop`.
In the repository settings, Pages → Source must be "GitHub Actions". The `github-pages` environment decides which refs
may deploy: releases started with **Run workflow** on `develop` deploy as `develop`, while a release started by pushing
a tag deploys as that tag, so add a `v*` tag rule there if you release that way.

## Releasing

Releases of `@frederikhd/quiet` are published to npm by `.github/workflows/release.yml` when a version tag is pushed.

1. In a PR into `develop`, set the new version in `packages/quiet/package.json` (semver; before 1.0, breaking changes
   bump the minor version) and move the entries under `## [Unreleased]` in `packages/quiet/CHANGELOG.md` into a
   `## [x.y.z] - YYYY-MM-DD` section.
2. Merge it once CI is green.
3. Start the release: Actions → **Release** → **Run workflow** on `develop` (it creates the `vx.y.z` tag), or tag the
   commit and push the tag yourself: `git tag vx.y.z && git push origin vx.y.z`.

The workflow checks that the tag, the package version and the changelog agree, runs the whole CI suite, publishes to
npm with provenance (a version with a suffix such as `0.2.0-beta.1` goes out under the `next` tag) and creates a
GitHub Release from the changelog section. It needs the repository secret `NPM_TOKEN` (Settings → Secrets and
variables → Actions): an npm _granular access token_ with read and write access to packages. For the very first
release the package doesn't exist yet, so give the token the whole `@frederikhd` scope; once it's published you can
narrow a new token to `@frederikhd/quiet`. The scope `@frederikhd` must be your npm username, or an npm organisation
you own. The publish job runs in the `npm` environment, so you can require an approval there before anything goes
out.
