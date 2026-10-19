import { mount } from '@vue/test-utils';
import { QBadge } from '@frederikhd/quiet';
import { describe, expect, it } from 'vitest';

describe('QBadge', () => {
  it('renders a neutral pill with its word', () => {
    const w = mount(QBadge, { slots: { default: 'Draft' } });
    expect(w.classes()).toEqual(['q-badge', 'q-badge--neutral']);
    expect(w.get('.q-badge__label').text()).toBe('Draft');
    expect(w.find('.q-lead').exists()).toBe(false);
  });

  it.each(['success', 'warning', 'info', 'danger', 'sale'] as const)('applies the %s tone', (tone) => {
    const w = mount(QBadge, { props: { tone }, slots: { default: 'Paid' } });
    expect(w.classes()).toContain(`q-badge--${tone}`);
  });

  it('falls back to neutral for an unknown tone', () => {
    const w = mount(QBadge, { props: { tone: 'shiny' as never }, slots: { default: 'Paid' } });
    expect(w.classes()).toContain('q-badge--neutral');
  });

  it('shows a small decorative icon before the word', () => {
    const w = mount(QBadge, { props: { tone: 'info', icon: 'truck' }, slots: { default: 'Shipped' } });
    const lead = w.get('.q-lead');
    expect(lead.attributes('aria-hidden')).toBe('true');
    expect(lead.find('svg.q-icon').exists()).toBe(true);
    expect(w.element.firstElementChild).toBe(lead.element);
  });

  it('passes class and attributes to the pill', () => {
    const w = mount(QBadge, { attrs: { class: 'extra', 'data-x': '1' }, slots: { default: 'Paid' } });
    expect(w.classes()).toContain('extra');
    expect(w.attributes('data-x')).toBe('1');
  });
});
