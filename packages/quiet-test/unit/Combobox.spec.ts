import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { QCombobox, QField, type ComboboxOption } from '@frederikhd/quiet';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';

const rates: ComboboxOption[] = [
  { value: 'de19', label: 'Germany, standard', meta: '19%' },
  { value: 'de7', label: 'Germany, reduced', meta: '7%' },
  { value: 'at20', label: 'Austria, standard', meta: '20%', disabled: true },
  { value: 'rh', label: 'Leinenweberei Rhön', description: 'Supplier' },
  { value: 'none', label: 'Tax exempt', keywords: 'zero' },
];

let wrapper: VueWrapper | null = null;
afterEach(() => {
  wrapper?.unmount();
  wrapper = null;
});

function inField(props: Record<string, unknown> = {}) {
  wrapper = mount(QField, {
    props: { id: 'rate', label: 'Tax rate', hint: 'Applied at checkout' },
    slots: { default: () => h(QCombobox, { options: rates, placeholder: 'Choose a rate', ...props }) },
    attachTo: document.body,
  });
  return wrapper;
}
const trigger = (w: VueWrapper) => w.get('button.q-combo__trigger');
const search = () => document.querySelector<HTMLInputElement>('.q-combo__search input')!;
const options = () => Array.from(document.querySelectorAll<HTMLElement>('[role="option"]'));
const status = () => document.querySelector('.q-combo__status')!.textContent;
async function open(w: VueWrapper) {
  await trigger(w).trigger('click');
  await flushPromises();
  await new Promise((r) => requestAnimationFrame(() => r(null)));
  await flushPromises();
}
async function type(text: string) {
  const s = search();
  s.value = text;
  s.dispatchEvent(new Event('input'));
  await flushPromises();
}
const key = async (el: Element, k: string) => {
  el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
  await flushPromises();
};

describe('QCombobox', () => {
  it('is a button that reads its label and value, and says it opens a dialog', () => {
    const w = inField();
    const t = trigger(w);
    expect(t.attributes('id')).toBe('rate');
    expect(t.attributes('aria-haspopup')).toBe('dialog');
    expect(t.attributes('aria-expanded')).toBe('false');
    const [labelId, valueId] = t.attributes('aria-labelledby')!.split(' ');
    expect(document.getElementById(labelId)!.textContent).toContain('Tax rate');
    expect(document.getElementById(valueId)!.textContent!.trim()).toBe('Choose a rate');
    expect(t.attributes('aria-describedby')).toBe('rate-hint');
    expect(w.get('.q-combo__value').classes()).toContain('q-combo__value--placeholder');
  });

  it('opens a listbox with a search field that takes focus, and a status line', async () => {
    const w = inField();
    await open(w);
    expect(trigger(w).attributes('aria-expanded')).toBe('true');
    const panelId = trigger(w).attributes('aria-controls')!;
    const panel = document.getElementById(panelId)!;
    expect(panel.getAttribute('role')).toBe('dialog');
    expect(panel.getAttribute('aria-label')).toBe('Tax rate');
    expect(document.activeElement).toBe(search());
    expect(search().getAttribute('role')).toBe('combobox');
    expect(search().getAttribute('aria-controls')).toBe(document.querySelector('[role="listbox"]')!.id);
    expect(options()).toHaveLength(5);
    expect(options()[2].getAttribute('aria-disabled')).toBe('true');
    expect(status()).toBe('5 results');
    expect(search().getAttribute('aria-activedescendant')).toBe(options()[0].id);
  });

  it('filters case- and accent-insensitively, by description and keywords', async () => {
    const w = inField();
    await open(w);
    await type('rhon');
    expect(options().map((o) => o.textContent)).toEqual(['Leinenweberei RhönSupplier']);
    expect(status()).toBe('1 result');
    await type('zero');
    expect(options()).toHaveLength(1);
    await type('xyz');
    expect(options()).toHaveLength(0);
    expect(status()).toBe('No matches for “xyz”');
    void w;
  });

  it('moves with the arrows past disabled options, chooses with Enter and returns focus', async () => {
    const w = inField();
    await open(w);
    await key(search(), 'ArrowDown'); // de7
    await key(search(), 'ArrowDown'); // skips the disabled at20 → rh
    expect(search().getAttribute('aria-activedescendant')).toBe(options()[3].id);
    await key(search(), 'ArrowUp');
    await key(search(), 'Enter');
    const qc = w.findComponent(QCombobox);
    expect(qc.emitted('update:modelValue')?.at(-1)).toEqual([rates[1]]);
    expect(trigger(w).attributes('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger(w).element);
  });

  it('chooses with a click and shows the label', async () => {
    const w = inField(); // no v-model: it keeps its own value
    await open(w);
    options()[4].click();
    await flushPromises();
    expect(w.get('.q-combo__value').text()).toBe('Tax exempt');
    expect(document.querySelector('[role="listbox"]')).toBeNull();
  });

  it('closes on Escape and gives focus back', async () => {
    const w = inField();
    await open(w);
    await key(search(), 'Escape');
    expect(trigger(w).attributes('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger(w).element);
  });

  it('opens from the keyboard: arrows, or a letter that starts the search', async () => {
    const w = inField();
    await key(trigger(w).element, 'ArrowDown');
    expect(trigger(w).attributes('aria-expanded')).toBe('true');
    await key(search(), 'Escape');
    await key(trigger(w).element, 'g');
    await flushPromises();
    expect(search().value).toBe('g');
    expect(options().map((o) => o.querySelector('.q-combo__label')!.textContent)).toEqual([
      'Germany, standard',
      'Germany, reduced',
    ]);
  });

  it('has a clear button for a single value', async () => {
    const w = inField({ modelValue: rates[0], clearable: true });
    const clear = w.get('.q-combo__clear');
    expect(clear.attributes('aria-label')).toBe('Clear');
    await clear.trigger('click');
    expect(w.findComponent(QCombobox).emitted('update:modelValue')?.at(-1)).toEqual([null]);
    expect(document.activeElement).toBe(trigger(w).element);
  });

  it('shows several values as removable tags, reads them out, and posts them', async () => {
    const chosen = [rates[0], rates[1], rates[3]];
    const w = inField({ multiple: true, modelValue: chosen, maxChips: 2, name: 'rates' });
    const tags = w.findAll('.q-tag:not(.q-tag--more)');
    expect(tags).toHaveLength(2);
    expect(w.get('.q-tag--more').text()).toBe('+1 more');
    expect(w.get('.q-combo__value').text()).toBe('3 selected: Germany, standard, Germany, reduced, Leinenweberei Rhön');
    expect(w.get('.q-combo__value').classes()).toContain('q-visually-hidden');
    expect(w.findAll('input[type="hidden"]').map((i) => i.attributes('value'))).toEqual(['de19', 'de7', 'rh']);
    const remove = tags[0].get('button');
    expect(remove.attributes('aria-label')).toBe('Remove Germany, standard');
    await remove.trigger('click');
    expect(w.findComponent(QCombobox).emitted('update:modelValue')?.at(-1)).toEqual([[rates[1], rates[3]]]);
  });

  it('toggles options without closing when multiple', async () => {
    const w = inField({ multiple: true, modelValue: [rates[0]] });
    await open(w);
    expect(document.querySelector('[role="listbox"]')!.getAttribute('aria-multiselectable')).toBe('true');
    expect(options()[0].getAttribute('aria-selected')).toBe('true');
    options()[1].click();
    await flushPromises();
    expect(w.findComponent(QCombobox).emitted('update:modelValue')?.at(-1)).toEqual([[rates[0], rates[1]]]);
    expect(trigger(w).attributes('aria-expanded')).toBe('true');
  });

  it('fetches with search(): "" on open, then debounced, with an error and retry', async () => {
    vi.useFakeTimers();
    let fail = false;
    const searchFn = vi.fn(async (q: string) => {
      if (fail) throw new Error('offline');
      return { options: rates.filter((r) => r.label.toLowerCase().includes(q.toLowerCase())).slice(0, 2), total: 1240 };
    });
    const w = inField({ options: undefined, search: searchFn, debounce: 300 });
    await trigger(w).trigger('click');
    await vi.runAllTimersAsync();
    expect(searchFn).toHaveBeenLastCalledWith('', expect.objectContaining({ signal: expect.anything() }));
    expect(status()).toBe('Showing 2 of 1,240. Type to search for more.');

    const s = search();
    s.value = 'ger';
    s.dispatchEvent(new Event('input'));
    await nextTick();
    expect(status()).toBe('Searching…');
    await vi.advanceTimersByTimeAsync(299);
    expect(searchFn).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(searchFn).toHaveBeenLastCalledWith('ger', expect.anything());

    fail = true;
    s.value = 'gerx';
    s.dispatchEvent(new Event('input'));
    await vi.runAllTimersAsync();
    expect(status()).toBe('Couldn’t load the results.');
    const retry = document.querySelector<HTMLButtonElement>('.q-combo__footer button')!;
    expect(retry.textContent).toContain('Try again');
    fail = false;
    retry.click();
    await vi.runAllTimersAsync();
    expect(searchFn).toHaveBeenCalledTimes(4);
    vi.useRealTimers();
  });

  it('does not open when disabled or read-only', async () => {
    const w = inField({ disabled: true });
    await trigger(w).trigger('click');
    await flushPromises();
    expect(trigger(w).attributes('aria-expanded')).toBe('false');
    expect(trigger(w).attributes('disabled')).toBeDefined();
    wrapper!.unmount();
    const r = inField({ readonly: true });
    expect(r.get('.q-combo').classes()).toContain('q-input--readonly');
    expect(trigger(r).attributes('disabled')).toBeDefined();
  });

  it('opens in a Dialog with dialog="always"', async () => {
    const w = inField({ dialog: 'always' });
    await trigger(w).trigger('click');
    await flushPromises();
    const dlg = document.querySelector('[aria-modal="true"]');
    expect(dlg).not.toBeNull();
    expect(dlg!.querySelector('[role="listbox"]')).not.toBeNull();
    // aria-controls only points at panels that exist.
    expect(trigger(w).attributes('aria-controls')).toBeUndefined();
  });

  it('is labelled by aria-label outside a Field', () => {
    wrapper = mount(QCombobox, { props: { options: rates, placeholder: 'Pick' }, attrs: { 'aria-label': 'Tax rate' } });
    const t = wrapper.get('button.q-combo__trigger');
    expect(t.attributes('aria-label')).toBe('Tax rate');
    expect(t.attributes('aria-labelledby')).toBeUndefined();
    expect(t.attributes('aria-describedby')).toBe(wrapper.get('.q-combo__value').attributes('id'));
  });

  it('marks invalid from the Field and passes required to the search field', async () => {
    wrapper = mount(QField, {
      props: { label: 'Product', error: 'Choose a product', required: true },
      slots: { default: () => h(QCombobox, { options: rates }) },
      attachTo: document.body,
    });
    const t = trigger(wrapper);
    expect(t.attributes('aria-invalid')).toBe('true');
    expect(t.attributes('aria-required')).toBeUndefined();
    expect(wrapper.get('.q-combo').classes()).toContain('q-input--invalid');
    await open(wrapper);
    expect(search().getAttribute('aria-required')).toBe('true');
  });
});
