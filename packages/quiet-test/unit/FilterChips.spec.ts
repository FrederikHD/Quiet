import { mount } from '@vue/test-utils';
import { QFilterChips, type FilterChip } from 'quiet';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

const ALL: FilterChip[] = [
  { key: 'navy', label: 'Navy', swatch: 'navy' },
  { key: 'm', label: 'Size M' },
  { key: 'stock', label: 'In stock' },
];
const mountChips = (props: Record<string, unknown> = {}) => {
  const w = mount(QFilterChips, {
    attachTo: document.body,
    props: {
      items: ALL,
      onRemove: (k: string) => w.setProps({ items: (w.props('items') as FilterChip[]).filter((x) => x && x.key !== k) }),
      onClear: () => w.setProps({ items: [] }),
      ...props,
    },
  });
  return w;
};

describe('QFilterChips', () => {
  it('is a named group of removable chips with Clear all', () => {
    const w = mountChips();
    const root = w.get('.q-fchips');
    expect(root.attributes('role')).toBe('group');
    expect(root.attributes('aria-label')).toBe('Active filters');
    const chips = w.findAll('.q-fchips__item button.q-tag');
    expect(chips.map((c) => c.attributes('aria-label'))).toEqual(['Remove filter: Navy', 'Remove filter: Size M', 'Remove filter: In stock']);
    // Label in name: the visible text is part of each chip's name.
    for (const c of chips) expect(c.attributes('aria-label')).toContain(c.text().trim());
    expect(w.get('.q-tag__dot').attributes('style')).toContain('--q-swatch: navy');
    expect(w.get('.q-fchips__clear').text()).toBe('Clear all');
    w.unmount();
  });

  it('skips null and false items', () => {
    const w = mountChips({ items: [ALL[0], null, false] });
    expect(w.findAll('.q-tag')).toHaveLength(1);
    expect(w.find('.q-fchips__clear').exists()).toBe(false);
    w.unmount();
  });

  it('moves focus to the next chip after a removal, then to the list', async () => {
    const w = mountChips();
    await w.findAll('.q-tag')[1].trigger('click');
    expect(w.emitted('remove')).toEqual([['m']]);
    await nextTick();
    expect(document.activeElement?.textContent).toContain('In stock');
    await w.findAll('.q-tag')[1].trigger('click');
    await nextTick();
    expect(document.activeElement?.textContent).toContain('Navy');
    await w.get('.q-tag').trigger('click');
    await nextTick();
    expect(w.get('.q-fchips').classes()).toContain('is-empty');
    expect(document.activeElement).toBe(w.get('.q-fchips').element);
    w.unmount();
  });

  it('clears all and keeps focus on the list, or on emptyFocus', async () => {
    const target = document.createElement('button');
    document.body.append(target);
    const w = mountChips({ emptyFocus: target });
    await w.get('.q-fchips__clear').trigger('click');
    expect(w.emitted('clear')).toHaveLength(1);
    await nextTick();
    expect(document.activeElement).toBe(target);
    w.unmount();
  });

  it('hides Clear all when not clearable', () => {
    const w = mountChips({ clearable: false });
    expect(w.find('.q-fchips__clear').exists()).toBe(false);
    w.unmount();
  });

  it('takes its own strings', () => {
    const w = mountChips({ strings: { label: 'Filter', remove: (l: string) => `${l} entfernen`, clear: 'Alle löschen' } });
    expect(w.get('.q-fchips').attributes('aria-label')).toBe('Filter');
    expect(w.get('.q-tag').attributes('aria-label')).toBe('Navy entfernen');
    expect(w.get('.q-fchips__clear').text()).toBe('Alle löschen');
    w.unmount();
  });
});
