import { mount } from '@vue/test-utils';
import { QMetric } from '@frederikhd/quiet';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';

describe('QMetric', () => {
  it('renders the label, the figure and the change', () => {
    const w = mount(QMetric, { props: { label: 'Sales', value: '4.280,00 €', change: { direction: 'up', value: '12 %', label: 'on yesterday' } } });
    expect(w.classes()).toEqual(['q-metric']);
    expect(w.get('.q-metric__label').text()).toBe('Sales');
    expect(w.get('.q-metric__value').text()).toBe('4.280,00 €');
    const ch = w.get('.q-metric__change');
    expect(ch.classes()).toContain('is-good');
    expect(ch.text()).toBe('up 12 % on yesterday');
    expect(ch.get('.q-visually-hidden').element.textContent).toBe('up ');
    expect(ch.get('.q-lead').attributes('aria-hidden')).toBe('true');
  });

  it('colours by goodWhen, never by colour alone', () => {
    const bad = mount(QMetric, { props: { label: 'Orders', value: 38, change: { direction: 'down', value: 3, label: 'on yesterday' } } });
    expect(bad.get('.q-metric__change').classes()).toContain('is-bad');
    expect(bad.get('.q-metric__change').text()).toBe('down 3 on yesterday');
    const good = mount(QMetric, { props: { label: 'Returns', value: 4, goodWhen: 'down', change: { direction: 'down', value: 2 } } });
    expect(good.get('.q-metric__change').classes()).toContain('is-good');
  });

  it('shows a flat change without an arrow or colour', () => {
    const w = mount(QMetric, { props: { label: 'Orders', value: 38, change: { direction: 'same', label: 'on yesterday' } } });
    const ch = w.get('.q-metric__change');
    expect(ch.classes()).not.toContain('is-good');
    expect(ch.classes()).not.toContain('is-bad');
    expect(ch.find('.q-lead').exists()).toBe(false);
    expect(ch.text()).toBe('no change on yesterday');
  });

  it('leaves out the change and the extra when not given; small size', () => {
    const w = mount(QMetric, { props: { label: 'To fulfil', value: 9, size: 'small' } });
    expect(w.classes()).toContain('q-metric--small');
    expect(w.find('.q-metric__change').exists()).toBe(false);
    expect(w.find('.q-metric__extra').exists()).toBe(false);
  });

  it('takes the extra, label and value slots, and translations', () => {
    const w = mount(QMetric, {
      props: { label: 'To fulfil', value: 9, change: { direction: 'up' }, strings: { up: 'mehr' } },
      slots: { default: () => h('a', { href: '#orders' }, 'View orders'), value: () => h('b', '9') },
    });
    expect(w.get('.q-metric__extra a').text()).toBe('View orders');
    expect(w.get('.q-metric__value b').text()).toBe('9');
    expect(w.get('.q-metric__change .q-visually-hidden').text()).toBe('mehr');
  });
});
