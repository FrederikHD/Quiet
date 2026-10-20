# Contributing to Quiet

Thanks for helping. This page is the workflow: how to set up, how a change gets in, how the screenshot tests work and
how a release goes out. The [README](README.md) has the full command list, how the code is organised and how to add a
component.

## Setup

You need Node 22 and npm. Docker is needed only for the screenshot tests.

```sh
npm install
npx playwright install chromium   # once, for the browser tests
npm run dev                        # the explorer on http://localhost:5173, running on the library's source
```

## Making a change

`develop` is the main branch, and it only takes pull requests. Branch off it, push the branch and open a PR into
`develop`. CI runs once per PR; merge when it is green.

| Check           | What it runs                                                                            |
| --------------- | --------------------------------------------------------------------------------------- |
| `test`          | lint, format, type-checks, unit tests, the package check, and the e2e suite in Chromium |
| `e2e (firefox)` | the e2e suite in Firefox                                                                |
| `e2e (webkit)`  | the e2e suite in WebKit (Safari's engine)                                               |
| `visual`        | the screenshot comparison of every example, light and dark                              |

Before you push, run what CI runs first:

```sh
npm run lint && npm run format:check && npm run typecheck && npm run test:unit
```

`npm run lint:fix` and `npm run format` fix most findings themselves.

Along with the code:

- **Library changes go in the changelog.** Add a line under `## [Unreleased]` in `packages/quiet/CHANGELOG.md`
  (Added, Changed, Fixed or Removed). Mark anything that breaks existing code with **Breaking:**.
- **Guidelines, examples and tests move with the component.** Update its `README.md`, its examples in
  `packages/quiet-explorer/src/examples/<Name>/`, and its unit tests in `packages/quiet-test/unit/`. The API tables and
  playground controls come from the TypeScript, so they update themselves.
- **Accessibility is part of done.** Use the keyboard and a screen reader on what you changed. The axe checks in the e2e
  suite catch some issues, not all.

## Visual tests

`packages/quiet-test/e2e/visual.spec.ts` takes a screenshot of every example in both themes and compares it with the
baselines in `packages/quiet-test/e2e/__screenshots__/linux/`. A pixel whose colour changes fails the test; the
comparison only ignores off-by-one anti-aliasing.

Fonts and browser builds differ between machines, so the tests always run in the official Playwright Docker image, the
version matching `@playwright/test`. CI does the same, so the results match exactly on any machine.

```sh
npm run test:visual                        # compare (needs Docker)
npm run test:visual:update -w quiet-test   # accept the new look after a deliberate change
```

After updating, look at the changed images in the diff before you commit them: each one should show the change you
meant to make, and nothing else. When the `visual` job fails in CI, download its `playwright-report-visual` artifact.
It shows the expected image, the actual one and the difference for each failure.

**When Dependabot updates Playwright,** the new browser may draw some things slightly differently. CI picks the
matching image by itself. If the `visual` job fails on that PR, check out its branch, run
`npm run test:visual:update -w quiet-test`, check the images and push them to the branch.

## Releasing

Releases publish `@frederikhd/quiet` to npm. The [README](README.md#releasing) has the details, including the
one-time trusted publishing setup on npmjs.com.

1. In a PR into `develop`, set the version in `packages/quiet/package.json` and turn `## [Unreleased]` in the
   changelog into `## [x.y.z] - YYYY-MM-DD`. Before 1.0, a release with breaking changes bumps the minor version
   (0.1.0 → 0.2.0).
2. Merge it once CI is green.
3. Actions → **Release** → **Run workflow** on `develop`. It checks that the version and the changelog agree, runs the
   whole CI suite, publishes to npm with provenance, creates the GitHub Release and its tag, and deploys the docs site.
