import { mount } from '@vue/test-utils';
import { QDescriptionList, type DescriptionListItem } from '@frederikhd/quiet';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';

const items: (DescriptionListItem | null | false)[] = [
  { term: 'SKU', description: 'LC-2040' },
  null,
  { term: 'Barcode', description: '' },
  { term: 'Weight', description: 0.35, numeric: true },
  false,
  { term: 'Total', description: '118,00 €', numeric: true, emphasis: true, key: 'total' },
];

describe('QDescriptionList', () => {
  it('renders a real dl with a term and description per item, skipping falsy items', () => {
    const w = mount(QDescriptionList, { props: { items } });
    expect(w.element.tagName).toBe('DL');
    expect(w.classes()).toEqual(['q-dl', 'q-dl--columns']);
    const rows = w.findAll('.q-dl__item');
    expect(rows).toHaveLength(4);
    expect(rows[0].get('dt.q-dl__term').text()).toBe('SKU');
    expect(rows[0].get('dd.q-dl__desc').text()).toBe('LC-2040');
    expect(rows[2].get('dd').classes()).toContain('is-numeric');
    expect(rows[3].classes()).toContain('q-dl__item--emphasis');
  });

  it('shows empty values as a dash, or emptyText', () => {
    expect(mount(QDescriptionList, { props: { items } }).get('.q-dl__empty').text()).toBe('—');
    expect(mount(QDescriptionList, { props: { items, emptyText: 'n/a' } }).get('.q-dl__empty').text()).toBe('n/a');
  });

  it.each(['inline', 'stacked'] as const)('applies the %s layout', (layout) => {
    expect(mount(QDescriptionList, { props: { items, layout } }).classes()).toContain(`q-dl--${layout}`);
  });

  it('adds dividers and the term width', () => {
    const w = mount(QDescriptionList, { props: { items, dividers: true, termWidth: '8rem' } });
    expect(w.classes()).toContain('q-dl--dividers');
    expect(w.attributes('style')).toContain('--q-dl-term: 8rem');
  });

  it('takes rich content in term-<key> / description-<key> slots (key or index)', () => {
    const w = mount(QDescriptionList, {
      props: { items },
      slots: { 'description-total': () => h('strong', '118,00 €'), 'term-0': ({ item }: { item: { term: string } }) => h('em', item.term) },
    });
    expect(w.get('dd strong').text()).toBe('118,00 €');
    expect(w.get('dt em').text()).toBe('SKU');
  });
});
