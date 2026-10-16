// The playground: controls change the preview, the code follows, and events are logged.
import { expect, test } from './fixtures';

test.describe('Button playground', () => {
  test.beforeEach(async ({ page }) => page.goto('/components/button/playground'));

  test('slot text, booleans and enums change the preview', async ({ page }) => {
    const preview = page.getByTestId('playground-preview');
    const controls = page.getByTestId('playground-controls');
    await controls.getByLabel('Slot: default').fill('Place order');
    const button = preview.getByRole('button', { name: 'Place order' });
    await expect(button).toBeVisible();

    await controls.getByLabel('disabled', { exact: true }).check();
    await expect(button).toBeDisabled();
    await controls.getByLabel('disabled', { exact: true }).uncheck();
    await expect(button).toBeEnabled();

    await controls.getByLabel('variant', { exact: true }).selectOption('danger');
    await expect(button).toHaveClass(/q-btn--danger/);
  });

  test('the code tab shows the template for the current props', async ({ page }) => {
    await page.getByTestId('playground-controls').getByLabel('variant', { exact: true }).selectOption('ghost');
    await page.getByRole('tab', { name: 'Code' }).click();
    await expect(page.getByText('<QButton variant="ghost"')).toBeVisible();
  });

  test('events are logged', async ({ page }) => {
    await page.getByTestId('playground-preview').getByRole('button').click();
    await page.getByRole('tab', { name: /Events/ }).click();
    await expect(page.getByTestId('playground-events')).toContainText('click(');
  });

  test('reset restores the story', async ({ page }) => {
    const controls = page.getByTestId('playground-controls');
    await controls.getByLabel('Slot: default').fill('Changed');
    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(page.getByTestId('playground-preview').getByRole('button', { name: 'Save changes' })).toBeVisible();
  });
});

test('v-model round-trips through the playground', async ({ page }) => {
  await page.goto('/components/checkbox/playground');
  const box = page.getByTestId('playground-preview').getByRole('checkbox');
  await expect(box).toBeChecked();
  await box.uncheck();
  await expect(page.getByTestId('playground-controls')).toContainText('v-model = false');
  await page.getByRole('tab', { name: /Events/ }).click();
  await expect(page.getByTestId('playground-events')).toContainText('update:modelValue(false)');
});

test('an overlay opens from the playground and closes with Escape', async ({ page }) => {
  await page.goto('/components/dialog/playground');
  await page.getByTestId('playground-preview').getByRole('button').first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.getByTestId('playground-controls')).toContainText('v-model:open = false');
});

test('the preview width shows the phone layout', async ({ page }) => {
  await page.goto('/components/table/playground');
  await page.getByLabel('Preview width').selectOption('phone');
  const stage = page.getByTestId('playground-preview').locator('.ex-preview__stage');
  await expect(stage).toHaveCSS('max-width', '375px');
});
