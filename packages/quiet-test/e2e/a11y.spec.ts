// axe-core (WCAG 2.2 A and AA) on every component's guidelines, playground and examples, and on the examples
// again in the dark theme, where contrast is checked against the dark tokens.
import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { components, guides, patterns, slugOf } from './catalog';
import { expect, test } from './fixtures';

async function violations(page: Page) {
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  return results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
}

for (const path of ['/', '/foundations/tokens', '/foundations/icons']) {
  test(`${path} has no axe violations`, async ({ page }) => {
    await page.goto(path);
    expect(await violations(page)).toEqual([]);
  });
}

for (const path of guides) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${path} has no axe violations, ${theme}`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('quiet-explorer-theme', t), theme);
      await page.goto(path);
      await expect(page.getByRole('main').getByRole('heading', { level: 2 }).first()).toBeVisible();
      expect(await violations(page)).toEqual([]);
    });
  }
}

for (const path of patterns) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${path} has no axe violations, ${theme}`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('quiet-explorer-theme', t), theme);
      await page.goto(path);
      await expect(page.getByTestId('pattern').getByRole('heading').first()).toBeVisible();
      expect(await violations(page)).toEqual([]);
    });
  }
}

for (const folder of components) {
  test.describe(folder, () => {
    for (const tab of ['', '/playground', '/examples']) {
      test(`${tab.slice(1) || 'guidelines'} has no axe violations`, async ({ page }) => {
        await page.goto(`/components/${slugOf(folder)}${tab}`);
        expect(await violations(page)).toEqual([]);
      });
    }

    test('examples have no axe violations in the dark theme', async ({ page }) => {
      await page.addInitScript(() => localStorage.setItem('quiet-explorer-theme', 'dark'));
      await page.goto(`/components/${slugOf(folder)}/examples`);
      expect(await violations(page)).toEqual([]);
    });
  });
}
