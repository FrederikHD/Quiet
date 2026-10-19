import { mount } from '@vue/test-utils';
import { QButton, QEmptyState } from '@frederikhd/quiet';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';

describe('QEmptyState', () => {
  it('renders a search icon, an h2 title, the text and actions', () => {
    const w = mount(QEmptyState, {
      props: { title: 'No products match these filters' },
      slots: { default: () => h('p', 'Try removing a filter or two.'), actions: () => h(QButton, null, () => 'Clear filters') },
    });
    expect(w.classes()).toEqual(['q-empty']);
    const icon = w.get('.q-empty__icon');
    expect(icon.attributes('aria-hidden')).toBe('true');
    expect(icon.find('svg').exists()).toBe(true);
    expect(w.get('h2.q-empty__title').text()).toBe('No products match these filters');
    expect(w.get('.q-empty__text').text()).toBe('Try removing a filter or two.');
    expect(w.get('.q-empty__actions button').text()).toBe('Clear filters');
  });

  it('leaves out text and actions when not given', () => {
    const w = mount(QEmptyState, { props: { title: 'No orders today' } });
    expect(w.find('.q-empty__text').exists()).toBe(false);
    expect(w.find('.q-empty__actions').exists()).toBe(false);
  });

  it('uses the heading level, the small size and no icon when asked', () => {
    const w = mount(QEmptyState, { props: { title: 'No reviews yet', headingLevel: 3, size: 'small', icon: null } });
    expect(w.find('h3.q-empty__title').exists()).toBe(true);
    expect(w.classes()).toContain('q-empty--small');
    expect(w.find('.q-empty__icon').exists()).toBe(false);
  });

  it('takes a role, so a replaced result list is announced', () => {
    const w = mount(QEmptyState, { props: { title: 'No results', role: 'status' } });
    expect(w.attributes('role')).toBe('status');
    expect(mount(QEmptyState, { props: { title: 'No results' } }).attributes('role')).toBeUndefined();
  });

  it('takes a rich title from the title slot', () => {
    const w = mount(QEmptyState, { props: { title: '' }, slots: { title: () => ['No results for ', h('q', 'lnen')] } });
    expect(w.get('.q-empty__title q').text()).toBe('lnen');
  });
});
