// Keyboard and pointer behaviour of the interactive components, exercised through their examples.
import { expect, test } from './fixtures';

test.describe('Dialog', () => {
  test.beforeEach(async ({ page }) => page.goto('/components/dialog/examples'));

  test('traps focus, closes with Escape and gives focus back', async ({ page }) => {
    const opener = page.getByRole('button', { name: 'Edit address' });
    await opener.click();
    const dialog = page.getByRole('dialog', { name: 'Edit shipping address' });
    await expect(dialog).toBeVisible();
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab');
      expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test('an alertdialog runs its action', async ({ page }) => {
    await page.getByRole('button', { name: 'Delete product' }).click();
    const dialog = page.getByRole('alertdialog');
    await dialog.getByRole('button', { name: 'Delete product' }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('status').filter({ hasText: 'Product deleted.' })).toBeVisible();
  });
});

test('Menu: arrow keys move between items, Enter chooses', async ({ page }) => {
  await page.goto('/components/menu/examples');
  await page.getByRole('button', { name: 'Actions for Linen shirt, blue' }).click();
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('menuitem', { name: 'Edit' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitem', { name: 'Duplicate' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(menu).toBeHidden();
  await expect(page.getByText('Chose: Duplicate')).toBeVisible();
});

test('Tabs: arrow keys move the selection', async ({ page }) => {
  await page.goto('/components/tabs/examples');
  const list = page.getByTestId('example').first().getByRole('tablist');
  const tabs = list.getByRole('tab');
  await tabs.first().click();
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
});

test('Combobox: typing filters, arrow keys and Enter pick', async ({ page }) => {
  await page.goto('/components/combobox/examples');
  const trigger = page.locator('.q-field', { hasText: 'Tax rate' }).locator('button').first();
  await trigger.click();
  const search = page.getByRole('combobox', { name: 'Tax rate' });
  await expect(search).toBeFocused();
  const listbox = page.getByRole('listbox');
  await search.fill('austria, red');
  await expect(listbox.getByRole('option')).toHaveCount(1);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(listbox).toBeHidden();
  await expect(trigger).toContainText('Austria, reduced');
  await expect(trigger).toBeFocused();
});

test('Table: a sortable header sorts the rows', async ({ page }) => {
  await page.goto('/components/table/examples');
  const table = page.getByTestId('example').first().getByRole('table');
  const header = table.locator('th[aria-sort]').first();
  const before = await header.getAttribute('aria-sort');
  await header.getByRole('button').click();
  await expect(header).not.toHaveAttribute('aria-sort', before ?? 'none');
});

test('Toast: a confirmation appears and can be dismissed', async ({ page }) => {
  await page.goto('/components/toast/examples');
  await page.getByRole('button', { name: 'Save product' }).click();
  const toast = page.locator('.q-toast').first();
  await expect(toast).toBeVisible();
  await toast.getByRole('button', { name: 'Dismiss' }).click();
  await expect(toast).toBeHidden();
});

test('Disclosure: toggles its content', async ({ page }) => {
  await page.goto('/components/disclosure/examples');
  const trigger = page.getByTestId('example').first().locator('[aria-expanded]').first();
  const expanded = await trigger.getAttribute('aria-expanded');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', expanded === 'true' ? 'false' : 'true');
});

test('Theme and density switch the whole explorer', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Theme').selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('a segmented Tabs inside a line Tabs keeps its own look (no underline)', async ({ page }) => {
  // The playground's Props/Code/Events switch is segmented and sits inside the page's line tabs.
  await page.goto('/components/button/playground');
  const active = page.getByRole('tab', { name: 'Props' });
  await expect(active).toHaveAttribute('aria-selected', 'true');
  const underline = await active.evaluate((el) => getComputedStyle(el, '::before').content);
  expect(underline).toBe('none');
});

test('the examples index links to each example', async ({ page }) => {
  await page.goto('/components/button/examples');
  const index = page.getByRole('navigation', { name: 'Examples on this page' });
  const links = index.getByRole('link');
  // The page renders once its examples have loaded, which can be after the load event.
  await expect(index).toBeVisible();
  await expect(links).toHaveCount(await page.getByTestId('example').count());
  const last = links.last();
  const hash = (await last.getAttribute('href'))!.split('#')[1];
  await last.click();
  await expect(page).toHaveURL(new RegExp(`#${hash}$`));
  await expect(page.locator(`#${hash}`)).toBeInViewport();
});
