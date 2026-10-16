// Every component page, in every tab, renders without a console error or warning.
import { components, slugOf } from './catalog';
import { expect, test } from './fixtures';

test('the overview lists every component in the navigation', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation').first();
  for (const folder of components) {
    await expect(nav.getByRole('link', { name: folder, exact: true })).toBeAttached();
  }
});

test('the foundations pages render', async ({ page }) => {
  await page.goto('/foundations/tokens');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.goto('/foundations/icons');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('an unknown address shows the not-found page', async ({ page }) => {
  await page.goto('/nowhere');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

for (const folder of components) {
  test.describe(folder, () => {
    const base = `/components/${slugOf(folder)}`;

    test('guidelines', async ({ page }) => {
      await page.goto(base);
      await expect(page.getByRole('heading', { level: 1, name: folder })).toBeVisible();
    });

    test('playground', async ({ page }) => {
      await page.goto(`${base}/playground`);
      await expect(page.getByTestId('playground-preview')).toBeVisible();
    });

    test('API', async ({ page }) => {
      await page.goto(`${base}/api`);
      await expect(page.getByTestId('api').getByRole('table').first()).toBeVisible();
    });

    test('examples', async ({ page }) => {
      await page.goto(`${base}/examples`);
      await expect(page.getByTestId('example').first()).toBeVisible();
    });
  });
}
