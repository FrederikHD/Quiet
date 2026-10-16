// axe-core on every component's guidelines and examples (WCAG 2.2 A and AA).
import AxeBuilder from '@axe-core/playwright';
import { components, slugOf } from './catalog';
import { expect, test } from './fixtures';

for (const folder of components) {
  for (const tab of ['', '/examples']) {
    test(`${folder}${tab || ' guidelines'} has no axe violations`, async ({ page }) => {
      await page.goto(`/components/${slugOf(folder)}${tab}`);
      await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
      expect(summary).toEqual([]);
    });
  }
}
