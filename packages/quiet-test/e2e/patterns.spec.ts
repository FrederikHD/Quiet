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

test.describe('Collection', () => {
  test('a filter narrows the list, lives in the URL and comes off with its chip', async ({ page }) => {
    await page.goto('/patterns/collection');
    const screen = page.getByTestId('pattern');
    const count = screen.getByRole('status').filter({ hasText: 'products' });
    await expect(count).toHaveText('40 products');

    await screen.getByRole('checkbox', { name: /^Navy/ }).press('Space');
    await expect(page).toHaveURL(/colour=Navy/);
    await expect(count).not.toHaveText('40 products');
    const filtered = await count.textContent();

    await page.reload();
    await expect(screen.getByRole('checkbox', { name: /^Navy/ })).toBeChecked();
    await expect(count).toHaveText(filtered!);

    await screen.getByRole('button', { name: 'Remove filter: Navy' }).click();
    await expect(count).toHaveText('40 products');
    await expect(page).not.toHaveURL(/colour=/);
  });

  test('"Show more" adds the next 12 and moves focus to the first of them', async ({ page }) => {
    await page.goto('/patterns/collection');
    const screen = page.getByTestId('pattern');
    await expect(screen.getByText('Showing 12 of 40')).toBeVisible();
    await screen.getByRole('button', { name: 'Show more' }).click();
    await expect(screen.getByText('Showing 24 of 40')).toBeVisible();
    await expect(screen.locator('.q-pcard__link').nth(12)).toBeFocused();
  });

  test('filters that match nothing offer to clear them', async ({ page }) => {
    await page.goto('/patterns/collection?max=20');
    const screen = page.getByTestId('pattern');
    await expect(screen.getByText('No products match these filters')).toBeVisible();
    await screen.getByRole('button', { name: 'Clear filters' }).click();
    await expect(screen.getByRole('status').filter({ hasText: 'products' })).toHaveText('40 products');
  });

  test('on a phone the filters open in a sheet that says how many products it will show', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/patterns/collection');
    const screen = page.getByTestId('pattern');
    await screen.getByRole('button', { name: 'Filter', exact: true }).click();
    const sheet = page.getByRole('dialog', { name: 'Filter' });
    await sheet.getByRole('checkbox', { name: 'In stock only' }).check();
    const show = sheet.getByRole('button', { name: /^Show \d+ products$/ });
    await expect(show).not.toHaveText('Show 40 products');
    await show.click();
    await expect(sheet).toBeHidden();
    await expect(screen.getByRole('button', { name: 'Filter (1)' })).toBeVisible();
    await expect(page).toHaveURL(/stock=1/);
  });
});

test.describe('Product edit', () => {
  test('lists what is wrong on Save, then saves the fixed product', async ({ page }) => {
    await page.goto('/patterns/product-edit');
    const screen = page.getByTestId('pattern');
    await screen.getByRole('textbox', { name: 'Title' }).fill('');
    await screen.getByRole('textbox', { name: 'Stock of Navy / M' }).fill('lots');
    await expect(screen.getByText('Unsaved changes')).toBeVisible();

    await screen.getByRole('button', { name: 'Save' }).click();
    const summary = screen.getByRole('region', { name: 'Please fix the following' });
    await expect(summary.getByRole('link')).toHaveText([
      'Enter a product title',
      'Enter the stock of Navy / M as a whole number, like 12',
    ]);
    await summary.getByRole('link', { name: /stock of Navy \/ M/ }).click();
    await expect(screen.getByRole('textbox', { name: 'Stock of Navy / M' })).toBeFocused();

    await screen.getByRole('textbox', { name: 'Stock of Navy / M' }).fill('25');
    await screen.getByRole('textbox', { name: 'Title' }).fill('Linen shirt, washed');
    await screen.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Product saved')).toBeVisible();
    await expect(screen.getByRole('heading', { name: 'Linen shirt, washed', level: 1 })).toBeVisible();
    await expect(screen.getByText('Unsaved changes')).toHaveCount(0);
  });

  test('a colour adds its variants to the table', async ({ page }) => {
    await page.goto('/patterns/product-edit');
    const screen = page.getByTestId('pattern');
    await expect(screen.getByText('8 variants', { exact: false })).toBeVisible();
    await screen.getByRole('checkbox', { name: /^Olive/ }).press('Space');
    await expect(screen.getByText('12 variants', { exact: false })).toBeVisible();
    await expect(screen.getByRole('textbox', { name: 'Stock of Olive / M' })).toHaveValue('0');
  });

  test('leaving with unsaved changes asks first, and discarding restores the saved product', async ({ page }) => {
    await page.goto('/patterns/product-edit');
    const screen = page.getByTestId('pattern');
    await screen.getByRole('textbox', { name: 'Title' }).fill('Linen shirt, washed');

    await screen.getByRole('link', { name: 'Products' }).first().click();
    const confirm = page.getByRole('dialog', { name: 'Discard unsaved changes?' });
    await confirm.getByRole('button', { name: 'Keep editing' }).click();
    await expect(screen.getByRole('textbox', { name: 'Title' })).toHaveValue('Linen shirt, washed');

    await screen.getByRole('button', { name: 'Discard' }).click();
    await confirm.getByRole('button', { name: 'Discard changes' }).click();
    await expect(screen.getByRole('textbox', { name: 'Title' })).toHaveValue('Linen shirt');
    await expect(screen.getByRole('button', { name: 'Discard' })).toBeDisabled();
  });

  test('deleting is confirmed first and can be undone', async ({ page }) => {
    await page.goto('/patterns/product-edit');
    const screen = page.getByTestId('pattern');
    await screen.getByRole('button', { name: 'Delete product' }).click();
    await page
      .getByRole('dialog', { name: 'Delete Linen shirt?' })
      .getByRole('button', { name: 'Delete product' })
      .click();
    await expect(screen.getByText('Linen shirt was deleted')).toBeVisible();
    await screen.getByRole('button', { name: 'Undo' }).click();
    await expect(screen.getByRole('heading', { name: 'Linen shirt', level: 1 })).toBeVisible();
  });
});

test.describe('Checkout', () => {
  test('goes through address, shipping and payment to the confirmation, asking for what is missing', async ({
    page,
  }) => {
    await page.goto('/patterns/checkout');
    const screen = page.getByTestId('pattern');

    await screen.getByRole('button', { name: 'Continue to shipping' }).click();
    await expect(screen.getByText('Enter your street and house number').first()).toBeVisible();
    await screen.getByLabel('Street and house number').fill('Torstraße 115');
    await screen.getByLabel('Postcode').fill('10119');
    await screen.getByLabel('City').fill('Berlin');
    await screen.getByRole('button', { name: 'Continue to shipping' }).click();

    await expect(screen.getByRole('heading', { name: 'Shipping', level: 2 })).toBeFocused();
    await screen.getByRole('button', { name: 'Continue to payment' }).click();
    await expect(screen.getByText('Choose a delivery method').first()).toBeVisible();
    await screen.getByText('Express', { exact: true }).click();
    await screen.getByRole('button', { name: 'Continue to payment' }).click();

    await expect(screen.getByRole('heading', { name: 'Payment', level: 2 })).toBeFocused();
    const buy = screen.getByRole('button', { name: 'Buy now · 147,90 €' });
    await screen.getByText('Invoice', { exact: true }).click();
    await buy.click();
    await expect(screen.getByText('Accept the terms to place your order').first()).toBeVisible();
    await screen.getByText('I accept the terms and the cancellation policy').click();
    await buy.click();

    await expect(screen.getByRole('heading', { name: 'Thank you, Anna' })).toBeFocused();
    await expect(screen.getByText('Express, next working day')).toBeVisible();
    await expect(screen.getByText('Invoice, within 14 days')).toBeVisible();
  });

  test('a discount code lowers the total, and a finished step leads back', async ({ page }) => {
    await page.goto('/patterns/checkout');
    const screen = page.getByTestId('pattern');
    await screen.getByRole('button', { name: 'Add a discount code' }).click();
    await screen.getByLabel('Discount code').fill('LINEN10');
    await screen.getByRole('button', { name: 'Apply' }).click();
    await expect(screen.getByText('124,20 €').first()).toBeVisible();

    await screen.getByLabel('Street and house number').fill('Torstraße 115');
    await screen.getByLabel('Postcode').fill('10119');
    await screen.getByLabel('City').fill('Berlin');
    await screen.getByRole('button', { name: 'Continue to shipping' }).click();
    await screen.getByRole('button', { name: /Address/ }).click();
    await expect(screen.getByRole('heading', { name: 'Address', level: 2, exact: true })).toBeFocused();
    await expect(screen.getByLabel('City')).toHaveValue('Berlin');
  });
});
