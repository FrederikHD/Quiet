import { mount } from '@vue/test-utils';
import { QFormSection } from '@frederikhd/quiet';
import { describe, expect, it } from 'vitest';

describe('QFormSection', () => {
  it('is a section named by its heading', () => {
    const w = mount(QFormSection, {
      props: { title: 'Pricing', description: 'Prices include VAT.' },
      slots: { default: () => 'fields' },
    });
    const section = w.get('section.q-fsection');
    const h2 = w.get('h2.q-fsection__title');
    expect(h2.text()).toBe('Pricing');
    expect(section.attributes('aria-labelledby')).toBe(h2.attributes('id'));
    expect(w.get('.q-fsection__desc').text()).toBe('Prices include VAT.');
    expect(w.get('.q-fsection__body').text()).toBe('fields');
    expect(section.classes()).not.toContain('q-fsection--aside');
  });

  it('takes a heading level and the aside layout', () => {
    const w = mount(QFormSection, { props: { title: 'Store details', headingLevel: 3, layout: 'aside' } });
    expect(w.find('h3.q-fsection__title').exists()).toBe(true);
    expect(w.get('section').classes()).toContain('q-fsection--aside');
  });

  it('has no head and no name without a title or description', () => {
    const w = mount(QFormSection, { slots: { default: () => 'fields' } });
    expect(w.find('.q-fsection__head').exists()).toBe(false);
    expect(w.get('section').attributes('aria-labelledby')).toBeUndefined();
  });

  it('takes rich title and description slots', () => {
    const w = mount(QFormSection, { slots: { title: () => 'Shipping', description: () => 'Where we send it.' } });
    expect(w.get('h2').text()).toBe('Shipping');
    expect(w.get('section').attributes('aria-labelledby')).toBe(w.get('h2').attributes('id'));
    expect(w.get('.q-fsection__desc').text()).toBe('Where we send it.');
  });
});
