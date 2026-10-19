// The playground: controls change the preview, the code follows, and events are logged.
import { expect, test } from './fixtures';
import { components, slugOf } from './catalog';

test.describe('Button playground', () => {
  test.beforeEach(async ({ page }) => page.goto('/components/button/playground'));

  test('slot text, booleans and enums change the preview', async ({ page }) => {
    const preview = page.getByTestId('playground-preview');
    const controls = page.getByTestId('playground-controls');
    await controls.getByLabel('Content (default slot)').fill('Place order');
    const button = preview.getByRole('button', { name: 'Place order' });
    await expect(button).toBeVisible();

    await controls.getByRole('checkbox', { name: /^disabled/ }).check();
    await expect(button).toBeDisabled();
    await controls.getByRole('checkbox', { name: /^disabled/ }).uncheck();
    await expect(button).toBeEnabled();

    await controls.getByLabel('variant', { exact: true }).selectOption('danger');
    await expect(button).toHaveClass(/q-btn--danger/);
  });

  test('the code tab shows the template for the current props', async ({ page }) => {
    await page.getByTestId('playground-controls').getByLabel('variant', { exact: true }).selectOption('ghost');
    await page.getByRole('tab', { name: 'Code' }).click();
    await expect(page.getByText('<QButton variant="ghost"')).toBeVisible();
  });


  test('reset restores the story', async ({ page }) => {
    const controls = page.getByTestId('playground-controls');
    await controls.getByLabel('Content (default slot)').fill('Changed');
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
  const dialog = page.getByRole('alertdialog');
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

// Every prop on the API tab can be set in the playground, or is listed under the controls with the reason it can't
// (a function or an element only code can pass, or a prop the playground has to own).
for (const folder of components) {
  test(`${folder}: every prop has a control or a stated reason`, async ({ page }) => {
    await page.goto(`/components/${slugOf(folder)}/api`);
    const props = await page.getByRole('table', { name: /props$/ }).first().locator('tbody tr td:first-child code').allTextContents();
    await page.goto(`/components/${slugOf(folder)}/playground`);
    const controls = page.getByTestId('playground-controls');
    await expect(controls).toBeVisible();
    const labels = await controls.locator('.q-field__label, .q-choice__label').allTextContents();
    const note = page.getByTestId('playground-not-editable');
    const rest = (await note.count()) ? ((await note.textContent()) ?? '') : '';
    for (const name of props) {
      const controlled = labels.some((l) => l.trim().replace(/\s*\*$/, '') === name || l.trim().startsWith(`${name} (JSON)`));
      const listed = new RegExp(`\\b${name} \\((a function|an element|set by this playground)\\)`).test(rest);
      expect(controlled || listed, `${folder}: ${name}`).toBe(true);
    }
  });
}

test('EmptyState: the icon can be changed and removed', async ({ page }) => {
  await page.goto('/components/empty-state/playground');
  const preview = page.getByTestId('playground-preview');
  const icon = page.getByTestId('playground-controls').getByLabel('icon', { exact: true });
  await icon.selectOption({ label: 'package' });
  await expect(preview.locator('.q-empty__icon')).toHaveCount(1);
  await icon.selectOption({ label: 'null' });
  await expect(preview.locator('.q-empty__icon')).toHaveCount(0);
  await page.getByRole('tab', { name: 'Code' }).click();
  await expect(page.getByText(':icon="null"')).toBeVisible();
});

test('named slots have no controls: their props do (Input prefix, Card title)', async ({ page }) => {
  for (const [slug, prop] of [['input', 'prefix'], ['card', 'title']] as const) {
    await page.goto(`/components/${slug}/playground`);
    const controls = page.getByTestId('playground-controls');
    await expect(controls.getByLabel(prop, { exact: true })).toBeVisible();
    await expect(controls.getByText(/^Slot:/)).toHaveCount(0);
    await expect(controls.getByText(`#${prop}`)).toHaveCount(0);
  }
});
