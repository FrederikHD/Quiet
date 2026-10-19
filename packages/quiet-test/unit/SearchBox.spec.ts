import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { QSearchBox, type SearchSuggestion } from '@frederikhd/quiet';
import { afterEach, describe, expect, it } from 'vitest';

enableAutoUnmount(afterEach);

const flat: SearchSuggestion[] = [
  { id: 'ls', label: 'Linen shirt', description: 'Shirts', image: 'data:image/png;base64,', meta: '59,00 €' },
  { id: 'lt', label: 'Linen trousers' },
];
const groups = [
  { label: 'Collections', items: [{ id: 'shirts', label: 'Shirts', icon: 'grid' as const }] },
  { label: 'Empty', items: [] },
  { label: 'Products', items: flat },
];

function box(props: Record<string, unknown> = {}) {
  return mount(QSearchBox, { props: { suggestions: flat, ...props }, attachTo: document.body });
}
async function typeIn(w: ReturnType<typeof box>, text: string) {
  const input = w.get('input');
  await input.trigger('focus');
  await input.setValue(text);
  await flushPromises();
  return input;
}
const opts = () => Array.from(document.querySelectorAll('[role="option"]'));

describe('QSearchBox', () => {
  it('is a search form with a labelled combobox, closed at first', () => {
    const w = box();
    expect(w.get('form').attributes('role')).toBe('search');
    const input = w.get('input');
    expect(input.attributes('type')).toBe('search');
    expect(input.attributes('role')).toBe('combobox');
    expect(input.attributes('aria-autocomplete')).toBe('list');
    expect(input.attributes('aria-expanded')).toBe('false');
    expect(input.attributes('aria-controls')).toBeUndefined();
    expect(input.attributes('autocomplete')).toBe('off');
    expect(input.attributes('enterkeyhint')).toBe('search');
    expect(input.attributes('placeholder')).toBe('Search');
    const label = w.get('label.q-visually-hidden');
    expect(label.text()).toBe('Search');
    expect(label.attributes('for')).toBe(input.attributes('id'));
  });

  it('shows suggestions and "Search for …" as you type, and announces the count', async () => {
    const w = box();
    const input = await typeIn(w, 'lin');
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual(['lin']);
    await w.setProps({ modelValue: 'lin' });
    expect(input.attributes('aria-expanded')).toBe('true');
    const list = w.get('[role="listbox"]');
    expect(input.attributes('aria-controls')).toBe(list.attributes('id'));
    expect(list.attributes('aria-label')).toBe('Search');
    expect(opts().map((o) => o.querySelector('.q-search__label')?.textContent)).toEqual(['Linen shirt', 'Linen trousers', 'Search for “lin”']);
    const first = opts()[0];
    expect(first.querySelector('img')?.getAttribute('alt')).toBe('');
    expect(first.querySelector('.q-search__desc')?.textContent).toBe('Shirts');
    expect(first.querySelector('.q-search__meta')?.textContent).toBe('59,00 €');
    expect(w.get('[aria-live="polite"]').text()).toBe('2 suggestions');
  });

  it('stays closed while the query is blank', async () => {
    const w = box();
    await typeIn(w, '   ');
    await w.setProps({ modelValue: '   ' });
    expect(w.find('[role="listbox"]').exists()).toBe(false);
  });

  it('renders labelled groups and skips empty ones', async () => {
    const w = box({ suggestions: groups, modelValue: 'sh' });
    await w.get('input').trigger('focus');
    const g = w.findAll('[role="group"]');
    expect(g).toHaveLength(2);
    const label = w.get('.q-search__grouplabel');
    expect(label.text()).toBe('Collections');
    expect(label.attributes('aria-hidden')).toBe('true');
    expect(g[0].attributes('aria-labelledby')).toBe(label.attributes('id'));
    expect(opts().map((o) => o.id.split('-opt-')[1])).toEqual(['0', '1', '2', '3']);
    expect(opts()[0].querySelector('.q-lead')).not.toBeNull();
  });

  it('↓ ↑ move the active option, Enter chooses it', async () => {
    const w = box({ modelValue: 'lin' });
    const input = w.get('input');
    await input.trigger('focus');
    await input.trigger('keydown', { key: 'ArrowDown' });
    expect(input.attributes('aria-activedescendant')).toBe(opts()[0].id);
    expect(opts()[0].getAttribute('aria-selected')).toBe('true');
    expect(opts()[1].getAttribute('aria-selected')).toBe('false');
    await input.trigger('keydown', { key: 'ArrowUp' });
    expect(input.attributes('aria-activedescendant')).toBe(opts()[2].id); // wraps to "Search for"
    await input.trigger('keydown', { key: 'ArrowDown' });
    await input.trigger('keydown', { key: 'ArrowDown' });
    expect(input.attributes('aria-activedescendant')).toBe(opts()[1].id);
    await input.trigger('keydown', { key: 'Enter' });
    expect(w.emitted('select')![0][0]).toEqual(flat[1]);
    expect(w.find('[role="listbox"]').exists()).toBe(false);
  });

  it('Enter with nothing active, or the "Search for" option, submits the trimmed query', async () => {
    const w = box({ modelValue: ' linen ' });
    const input = w.get('input');
    await input.trigger('focus');
    await input.trigger('keydown', { key: 'Enter' });
    expect(w.emitted('submit')![0]).toEqual(['linen']);
    await input.trigger('focus');
    (opts().at(-1) as HTMLElement).click();
    expect(w.emitted('submit')![1]).toEqual(['linen']);
  });

  it('a click on a suggestion selects it', async () => {
    const w = box({ modelValue: 'lin' });
    await w.get('input').trigger('focus');
    (opts()[0] as HTMLElement).click();
    expect(w.emitted('select')![0][0]).toEqual(flat[0]);
  });

  it('Esc closes the list, Esc again clears', async () => {
    const w = box({ modelValue: 'lin' });
    const input = w.get('input');
    await input.trigger('focus');
    await input.trigger('keydown', { key: 'Escape' });
    expect(w.find('[role="listbox"]').exists()).toBe(false);
    expect(w.emitted('update:modelValue')).toBeUndefined();
    await input.trigger('keydown', { key: 'Escape' });
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual(['']);
  });

  it('closes when focus or a click goes elsewhere, and on Tab', async () => {
    const outside = document.createElement('button');
    document.body.append(outside);
    const w = box({ modelValue: 'lin' });
    const input = w.get('input');
    await input.trigger('focus');
    expect(w.find('[role="listbox"]').exists()).toBe(true);
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await flushPromises();
    expect(w.find('[role="listbox"]').exists()).toBe(false);
    await input.trigger('focus');
    await input.trigger('keydown', { key: 'Tab' });
    expect(w.find('[role="listbox"]').exists()).toBe(false);
  });

  it('searchOption false drops "Search for"; inline and large', async () => {
    const w = box({ modelValue: 'lin', searchOption: false, inline: true, size: 'large' });
    await w.get('input').trigger('focus');
    expect(opts()).toHaveLength(2);
    expect(w.get('.q-search__panel').classes()).toContain('q-search__panel--inline');
    expect(w.get('form').classes()).toContain('q-search--large');
  });

  it('the clear button empties the field and is named', async () => {
    const w = box({ modelValue: 'lin' });
    const clear = w.get('.q-input__clear');
    expect(clear.attributes('aria-label')).toBe('Clear search');
    await clear.trigger('click');
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual(['']);
  });

  it('takes label, placeholder, strings and autofocus', async () => {
    const w = box({ label: 'Search products', placeholder: 'Linen, shirts…', autofocus: true, strings: { searchFor: (q: string) => `Suche nach „${q}“`, count: () => 'n' } });
    await flushPromises();
    expect(w.get('label').text()).toBe('Search products');
    expect(w.get('input').attributes('placeholder')).toBe('Linen, shirts…');
    expect(document.activeElement).toBe(w.get('input').element);
    await w.setProps({ modelValue: 'x' });
    await w.get('input').trigger('focus');
    expect(opts().at(-1)!.textContent).toContain('Suche nach „x“');
    expect(w.get('[aria-live]').text()).toBe('n');
  });

  it('submitting the form searches', async () => {
    const w = box({ modelValue: 'lin' });
    await w.get('form').trigger('submit');
    expect(w.emitted('submit')![0]).toEqual(['lin']);
    const empty = box();
    await empty.get('form').trigger('submit');
    expect(empty.emitted('submit')).toBeUndefined();
  });
});
