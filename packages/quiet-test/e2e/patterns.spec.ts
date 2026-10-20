// The patterns' main flows, as someone using the screen would go through them.
import { expect, test } from './fixtures';

test.describe('Product page', () => {
  test('asks for a size, adds to the cart and shows it in the cart drawer', async ({ page }) => {
    await page.goto('/patterns/product-page');
    const screen = page.getByTestId('pattern');
    const cart = screen.getByRole('button', { name: /^Cart, / });
    await expect(cart).toHaveAccessibleName('Cart, 1 item');

    await screen.getByRole('button', { name: 'Add to cart' }).click();
    await expect(screen.getByText('Choose a size')).toBeVisible();

    // The tile's visible face (its screen-reader text says "M" too).
    await screen.getByRole('radiogroup', { name: 'Size' }).getByText('M', { exact: true }).first().click();
    await screen.getByRole('button', { name: 'Add to cart' }).click();
    await expect(page.getByText('Added Linen shirt to your cart')).toBeVisible();
    await expect(cart).toHaveAccessibleName('Cart, 2 items');

    await cart.click();
    const drawer = page.getByRole('dialog', { name: 'Cart (2)' });
    await expect(drawer.getByText('Navy · M')).toBeVisible();
    await expect(drawer.getByText('118,00 €')).toBeVisible();
  });

  test('offers "Notify me" for a sold-out size', async ({ page }) => {
    await page.goto('/patterns/product-page');
    const screen = page.getByTestId('pattern');
    await screen.getByRole('radiogroup', { name: 'Size' }).getByText('XL', { exact: true }).click();
    await expect(screen.getByText('Sold out in XL.', { exact: false })).toBeVisible();
    await screen.getByRole('button', { name: 'Notify me' }).click();
    await expect(page.getByText('We’ll email you when', { exact: false })).toBeVisible();
  });

  test('a cart line stepped down to 0 leaves the cart', async ({ page }) => {
    await page.goto('/patterns/product-page');
    await page
      .getByTestId('pattern')
      .getByRole('button', { name: /^Cart, / })
      .click();
    const drawer = page.getByRole('dialog', { name: 'Cart (1)' });
    await drawer.getByRole('spinbutton', { name: 'Quantity of Linen shirt, Sand, M' }).fill('0');
    await drawer.getByRole('spinbutton').press('Enter');
    await expect(page.getByRole('dialog', { name: 'Cart (0)' }).getByText('Your cart is empty')).toBeVisible();
  });
});

test.describe('Orders', () => {
  test('opens an order from its row, fulfils it and goes back to the list', async ({ page }) => {
    await page.goto('/patterns/orders');
    const screen = page.getByTestId('pattern');
    await screen.getByRole('row', { name: /#10564/ }).click();
    await expect(screen.getByRole('heading', { name: '#10564', level: 1 })).toBeVisible();

    await screen.getByRole('button', { name: 'Mark as fulfilled' }).click();
    await expect(page.getByText('Order #10564 marked as fulfilled')).toBeVisible();
    await expect(screen.getByRole('button', { name: 'Mark as fulfilled' })).toHaveCount(0);

    await screen.getByRole('link', { name: 'Orders' }).first().click();
    await expect(screen.getByRole('heading', { name: 'Orders', level: 1 })).toBeVisible();
    await expect(screen.getByRole('tab', { name: /Unfulfilled/ })).toContainText('11');
  });

  test('a refund is confirmed before it happens', async ({ page }) => {
    await page.goto('/patterns/orders');
    const screen = page.getByTestId('pattern');
    await screen.getByRole('row', { name: /#10564/ }).click();
    await screen.getByRole('button', { name: 'More actions for #10564' }).click();
    await page.getByRole('menuitem', { name: 'Refund' }).click();
    const confirm = page.getByRole('dialog', { name: 'Refund order #10564?' });
    await confirm.getByRole('button', { name: 'Cancel' }).click();
    await expect(screen.getByText('Paid', { exact: true })).toBeVisible();

    await screen.getByRole('button', { name: 'More actions for #10564' }).click();
    await page.getByRole('menuitem', { name: 'Refund' }).click();
    await confirm.getByRole('button', { name: /^Refund/ }).click();
    await expect(screen.getByText('Refunded', { exact: true })).toBeVisible();
  });

  test('the shipping address is edited in a dialog and validated', async ({ page }) => {
    await page.goto('/patterns/orders');
    const screen = page.getByTestId('pattern');
    await screen.getByRole('row', { name: /#10564/ }).click();
    await screen.getByRole('button', { name: 'Edit shipping address' }).click();
    const dialog = page.getByRole('dialog', { name: 'Edit shipping address' });
    await dialog.getByLabel('City').fill('');
    await dialog.getByRole('button', { name: 'Save address' }).click();
    await expect(dialog).toBeVisible();
    await dialog.getByLabel('City').fill('Potsdam');
    await dialog.getByRole('button', { name: 'Save address' }).click();
    await expect(page.getByText('Shipping address saved')).toBeVisible();
    await expect(screen.getByText('10119 Potsdam')).toBeVisible();
  });

  test('bulk "Mark as fulfilled" acts on the selected orders', async ({ page }) => {
    await page.goto('/patterns/orders');
    const screen = page.getByTestId('pattern');
    await screen.getByRole('tab', { name: /Unfulfilled/ }).click();
    await screen.getByRole('checkbox', { name: 'Select order #10564' }).check();
    await screen.getByRole('checkbox', { name: 'Select order #10563' }).check();
    await screen.getByRole('button', { name: 'Mark as fulfilled' }).click();
    await expect(page.getByText('2 orders marked as fulfilled')).toBeVisible();
    await expect(screen.getByRole('tab', { name: /Unfulfilled/ })).toContainText('10');
  });
});
