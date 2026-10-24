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

test('Tag: after Clear all, focus moves to the empty message', async ({ page }) => {
  await page.goto('/components/tag/examples');
  const example = page.getByTestId('example').first();
  await example.getByRole('button', { name: 'Clear all' }).click();
  await expect(example.getByText('No filters', { exact: true })).toBeFocused();
});

test('Steps: choosing a done step moves focus to its heading', async ({ page }) => {
  await page.goto('/components/steps/examples');
  const example = page.getByTestId('example').first();
  await example.getByRole('button', { name: /Address/ }).click();
  await expect(example.getByRole('heading', { name: 'Address' })).toBeFocused();
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

test('DatePicker: typing, the calendar keyboard, Escape and choosing', async ({ page }) => {
  await page.goto('/components/date-picker/examples');
  const field = page.getByRole('textbox', { name: 'Publish on' });
  await field.fill('3.1.2027');
  await field.press('Tab');
  await expect(field).toHaveValue('03.01.2027');
  const button = page.getByRole('button', { name: 'Choose date' }).first();
  await button.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Choose date' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Sonntag, 3. Januar 2027' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(button).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('PageDown');
  await expect(dialog.getByRole('heading', { name: 'Februar 2027' })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(dialog).toBeHidden();
  await expect(field).toHaveValue('04.02.2027');
  await expect(button).toBeFocused();
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

test.describe('FileUpload reordering', () => {
  test.beforeEach(async ({ page }) => page.goto('/components/file-upload/examples'));
  const names = (page: import('@playwright/test').Page) =>
    page.locator('.q-upload--images').first().locator('.q-upload__name');

  test('dragging a handle moves the image, and Escape puts it back', async ({ page }) => {
    const upload = page.locator('.q-upload--images').first();
    await expect(names(page)).toHaveText([/front/, /back/, /folded/]);
    const from = (await upload.getByRole('button', { name: /^Move .*front/ }).boundingBox())!;
    const to = (await upload.locator('.q-upload__item').nth(2).boundingBox())!;

    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();
    await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 15 });
    await page.keyboard.press('Escape');
    await page.mouse.up();
    await expect(names(page)).toHaveText([/front/, /back/, /folded/]);

    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();
    await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 15 });
    await page.mouse.up();
    await expect(names(page)).toHaveText([/back/, /folded/, /front/]);
    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(upload.getByRole('button', { name: /^Move .*front/ })).toBeFocused();
  });

  test('the arrow keys and the handle menu move it too', async ({ page }) => {
    const upload = page.locator('.q-upload--images').first();
    await upload.getByRole('button', { name: /^Move .*front/ }).press('ArrowRight');
    await expect(names(page)).toHaveText([/back/, /front/, /folded/]);
    await expect(upload.getByRole('button', { name: /^Move .*front/ })).toBeFocused();

    await upload.getByRole('button', { name: /^Move .*folded/ }).click();
    await page.getByRole('menuitem', { name: 'Make main image' }).click();
    await expect(names(page)).toHaveText([/folded/, /back/, /front/]);
    await expect(upload.locator('.q-upload__meta').first()).toContainText('Main image');
  });
});

test('Popover holding a field is wide enough for it and lines up with the end of its trigger', async ({ page }) => {
  await page.goto('/components/popover/examples');
  const trigger = page.getByRole('button', { name: 'Columns' });
  await trigger.click();
  const panel = page.getByRole('dialog', { name: 'Columns' });
  await expect(panel.getByRole('checkbox', { name: 'Product' })).toBeVisible();
  const p = (await panel.boundingBox())!;
  const t = (await trigger.boundingBox())!;
  expect(p.width).toBeGreaterThan(200);
  expect(Math.abs(p.x + p.width - (t.x + t.width))).toBeLessThan(1.5);
});

test.describe('Autofill', () => {
  // Chromium's DevTools protocol fills a form the way the browser's autofill does; the other engines have no such hook.
  test('keeps the field transparent, so the focus ring stays whole', async ({ playwright, browserName, baseURL }) => {
    test.skip(browserName !== 'chromium', 'Autofill.trigger is Chromium-only');
    // Full Chromium: the headless shell the other tests run in has no Autofill domain.
    const browser = await playwright.chromium.launch({ channel: 'chromium' });
    test.info().attach('browser', { body: browser.version() });
    const page = await browser.newPage({ baseURL });
    await page.goto('/components/input/examples');
    // A card form in Quiet's own markup (the classes are what the stylesheet styles), so autofill recognises it.
    await page.evaluate(() => {
      const form = document.createElement('form');
      form.innerHTML = ['cc-name', 'cc-number', 'cc-exp']
        .map(
          (a) =>
            `<div class="q-input"><input class="q-input__field" id="af-${a}" name="${a}" autocomplete="${a}"></div>`,
        )
        .join('');
      document.querySelector('main')!.prepend(form);
    });
    const cdp = await page.context().newCDPSession(page);
    const { root } = await cdp.send('DOM.getDocument');
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '#af-cc-number' });
    const { node } = await cdp.send('DOM.describeNode', { nodeId });
    await cdp.send('Autofill.trigger', {
      fieldId: node.backendNodeId,
      card: { number: '4444444444444444', name: 'Anna Schmidt', expiryMonth: '12', expiryYear: '2030', cvc: '123' },
    });
    const field = page.locator('#af-cc-number');
    await expect(field).toHaveValue('4444444444444444');
    expect(await field.evaluate((el) => el.matches(':autofill'))).toBe(true);
    // Nothing painted over the box: no inset shadow, and the browser's fill held at transparent.
    const { shadow, alpha } = await field.evaluate((el) => {
      const s = getComputedStyle(el);
      return { shadow: s.boxShadow, alpha: Number(s.backgroundColor.match(/[\d.]+(?=\))/)?.[0] ?? 1) };
    });
    expect(shadow).toBe('none');
    expect(alpha).toBeLessThan(0.05);
    await browser.close();
  });
});

test.describe('Focus rings', () => {
  // A ring drawn outside an item hides under the next item's background when items sit closer than the ring is wide,
  // and a scrolling container clips what sticks out. These items draw it inside, and the thumbnail strip leaves room.
  test('stacked Nav links and review rows draw the ring inside', async ({ page }) => {
    const ringFitsInside = (el: Element) => {
      const s = getComputedStyle(el);
      return parseFloat(s.outlineOffset) + parseFloat(s.outlineWidth) <= 0;
    };
    await page.goto('/foundations/tokens');
    // Brand book sits right above the current item (Tokens), whose tinted background would cover a ring drawn outside.
    const link = page.locator('.q-nav__link', { hasText: 'Brand book' });
    await link.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(link).toBeFocused();
    expect(await link.evaluate(ringFitsInside)).toBe(true);

    await page.goto('/components/review-summary/examples');
    const row = page.locator('button.q-rsum__row').first();
    await row.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(row).toBeFocused();
    expect(await row.evaluate(ringFitsInside)).toBe(true);
  });

  test('a Gallery thumbnail’s ring fits inside the scrolling strip', async ({ page }) => {
    await page.goto('/components/gallery/examples');
    const thumb = page.locator('.q-gallery__thumb').first();
    await thumb.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(thumb).toBeFocused();
    const room = await thumb.evaluate((el) => {
      const ring = parseFloat(getComputedStyle(el).outlineOffset) + parseFloat(getComputedStyle(el).outlineWidth);
      const strip = getComputedStyle(el.parentElement!);
      return { ring, top: parseFloat(strip.paddingTop), left: parseFloat(strip.paddingLeft) };
    });
    expect(room.top).toBeGreaterThanOrEqual(room.ring);
    expect(room.left).toBeGreaterThanOrEqual(room.ring);
  });
});

test.describe('AppShell collapsible', () => {
  // The explorer's own shell is collapsible and remembers the choice. A page with controls, so Tab has somewhere to go.
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/button/examples');
    await page.evaluate(() => localStorage.removeItem('quiet-explorer-nav'));
    await page.waitForLoadState('networkidle');
    await page.reload();
  });

  test('the edge button hides the column, keeps focus, and the page takes the width', async ({ page }) => {
    const main = page.locator('main');
    const hide = page.getByRole('button', { name: 'Hide navigation' });
    await expect(hide).toHaveAttribute('aria-expanded', 'true');
    const before = await main.evaluate((el) => el.getBoundingClientRect().left);
    await hide.focus();
    await page.keyboard.press('Enter');
    const show = page.getByRole('button', { name: 'Show navigation' });
    await expect(show).toBeFocused();
    await expect(show).toHaveAttribute('aria-expanded', 'false');
    await expect.poll(() => main.evaluate((el) => el.getBoundingClientRect().left)).toBeLessThan(before - 200);
    // The hidden links are out of the Tab order: the next stop is in the page.
    await expect(page.getByRole('link', { name: 'Brand book' })).toHaveCount(0);
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('main'))).toBe(true);
    // Remembered on the next visit, and the button brings it back. Settled first: a reload that cuts off a stylesheet
    // still loading is reported as a console error.
    await page.waitForLoadState('networkidle');
    await page.reload();
    await page.getByRole('button', { name: 'Show navigation' }).click();
    await expect(page.getByRole('link', { name: 'Brand book' })).toBeVisible();
    await expect.poll(() => main.evaluate((el) => el.getBoundingClientRect().left)).toBe(before);
  });

  test('below 1024px there is no edge button: the menu opens the drawer as before', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await expect(page.locator('.q-shell__collapse')).toBeHidden();
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(page.getByRole('dialog').getByRole('link', { name: 'Brand book' })).toBeVisible();
  });
});
