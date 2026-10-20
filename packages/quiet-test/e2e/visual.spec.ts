// Screenshots of every example and every pattern, light and dark. Update the baselines with `npm run test:visual:update`
// after a deliberate visual change, and review the new images in the diff. That script, like CI, runs them in the
// Playwright Docker image, so the baselines don't depend on the machine's fonts or browser build.
import { components, patterns, slugOf } from './catalog';
import { expect, test } from './fixtures';

for (const theme of ['light', 'dark'] as const) {
  for (const folder of components) {
    test(`${folder} examples, ${theme}`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('quiet-explorer-theme', t), theme);
      await page.goto(`/components/${slugOf(folder)}/examples`);
      await page.evaluate(() => document.fonts.ready);
      const examples = page.getByTestId('example');
      await expect(examples.first()).toBeVisible();
      for (let i = 0; i < (await examples.count()); i++) {
        await expect(examples.nth(i)).toHaveScreenshot(`${slugOf(folder)}-${i + 1}-${theme}.png`);
      }
    });
  }
}

for (const theme of ['light', 'dark'] as const) {
  for (const path of patterns) {
    test(`${path}, ${theme}`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('quiet-explorer-theme', t), theme);
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const screen = page.getByTestId('pattern');
      await expect(screen.getByRole('heading').first()).toBeVisible();
      await expect(screen).toHaveScreenshot(`pattern-${path.split('/').pop()}-${theme}.png`);
    });
  }
}
