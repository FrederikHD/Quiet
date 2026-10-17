// Phone and tablet widths: no page scrolls sideways, and the navigation becomes a drawer.
import { components, slugOf } from './catalog';
import { expect, test } from './fixtures';

const pageWidth = (page: import('@playwright/test').Page) =>
  page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));

for (const [device, width] of [['phone', 375], ['tablet', 768]] as const) {
  test.describe(`${device} (${width}px)`, () => {
    test.use({ viewport: { width, height: 800 } });

    for (const path of ['/', '/foundations/tokens', '/foundations/icons']) {
      test(`${path} fits the screen`, async ({ page }) => {
        await page.goto(path);
        await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
        const w = await pageWidth(page);
        expect(w.scroll).toBeLessThanOrEqual(w.client);
      });
    }

    for (const folder of components) {
      test(`${folder} fits the screen in every tab`, async ({ page }) => {
        for (const tab of ['', '/playground', '/api', '/examples']) {
          await page.goto(`/components/${slugOf(folder)}${tab}`);
          await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
          const w = await pageWidth(page);
          expect(w.scroll, `${folder}${tab}`).toBeLessThanOrEqual(w.client);
        }
      });
    }
  });
}

test.describe('phone navigation', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test('the menu opens a drawer, moves focus into it and closes after navigating', async ({ page }) => {
    await page.goto('/components/button');
    const menu = page.getByRole('button', { name: 'Menu' });
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('link', { name: 'Brand book' })).toBeFocused();
    await page.getByRole('link', { name: 'Table', exact: true }).click();
    await expect(page).toHaveURL(/\/components\/table$/);
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
  });

  test('Escape closes the drawer and returns focus to the menu button', async ({ page }) => {
    await page.goto('/');
    const menu = page.getByRole('button', { name: 'Menu' });
    await menu.click();
    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeFocused();
  });
});
