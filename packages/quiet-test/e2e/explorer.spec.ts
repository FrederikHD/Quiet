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

test('the guides are listed, link to each other in the app and show the complete German setup', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation').first();
  await nav.getByRole('link', { name: 'Getting started', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Getting started', level: 1 })).toBeVisible();
  await expect(page).toHaveTitle('Getting started · Quiet');
  await expect(nav.getByRole('link', { name: 'Getting started', exact: true })).toHaveAttribute('aria-current', 'page');

  // A link between guides routes in the app: the page doesn't reload.
  await page.evaluate(() => ((window as unknown as { stayed: boolean }).stayed = true));
  await page.getByRole('main').getByRole('link', { name: 'Translations' }).first().click();
  await expect(page).toHaveURL(/\/guides\/translations$/);
  await expect(page.getByRole('heading', { name: 'Translations', level: 1 })).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { stayed?: boolean }).stayed)).toBe(true);

  // The German strings are shown in place of their marker, and the Markdown's own title isn't repeated.
  const main = page.getByRole('main');
  await expect(
    main.locator('pre').filter({ hasText: "errorSummaryTitle: 'Bitte korrigieren Sie Folgendes'" }),
  ).toBeVisible();
  await expect(main.getByText('<!-- de.ts -->')).toHaveCount(0);
  await expect(main.getByRole('heading', { level: 1 })).toHaveCount(1);
  await page.goto('/guides/nothing');
  await expect(page.getByRole('heading', { name: 'Not found', level: 1 })).toBeVisible();
});

test('an unknown address shows the not-found page', async ({ page }) => {
  await page.goto('/nowhere');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('an unknown component, tab or pattern shows the not-found page and keeps its address', async ({ page }) => {
  for (const path of ['/components/nothing', '/components/button/nothing', '/patterns/nothing?x=1']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: 'Not found', level: 1 })).toBeVisible();
    expect(new URL(page.url()).pathname + new URL(page.url()).search).toBe(path);
  }
  await page.getByRole('main').getByRole('link', { name: 'Brand book' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'Quiet', level: 1 })).toBeVisible();
});

test('the icon filter says when nothing matches', async ({ page }) => {
  await page.goto('/foundations/icons');
  await page.getByRole('textbox', { name: 'Filter icons' }).fill('zzz');
  await expect(page.getByText('No icons match')).toBeVisible();
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
