import { mount } from '@vue/test-utils';
import { QPrice, configure } from 'quiet';
import { beforeAll, describe, expect, it } from 'vitest';
import { h } from 'vue';

beforeAll(() => configure({ locale: 'de-DE', currency: 'EUR' }));
const nb = (s: string) => s.replace(/\s/g, ' ');

describe('QPrice', () => {
  it('formats the amount in the configured locale and currency', () => {
    const w = mount(QPrice, { props: { amount: 59 } });
    expect(w.classes()).toEqual(['q-price', 'q-price--default']);
    expect(nb(w.get('.q-price__now').text())).toBe('59,00 €');
    expect(w.find('.q-price__was').exists()).toBe(false);
  });

  it('shows a sale to screen readers, not only as a strikethrough', () => {
    const w = mount(QPrice, { props: { amount: 59, compareAt: 79 } });
    expect(w.classes()).toContain('is-sale');
    expect(nb(w.get('.q-price__now').text())).toBe('Sale price 59,00 €');
    // The hidden prefixes keep their space (the template compiler would strip a literal trailing one).
    expect(w.get('.q-price__now .q-visually-hidden').element.textContent).toBe('Sale price ');
    expect(nb(w.get('s.q-price__was').element.textContent!)).toBe('Original price 79,00 €');
    expect(w.find('.q-price__saving').exists()).toBe(false);
  });

  it('adds the saving badge, read as "25% off"', () => {
    const w = mount(QPrice, { props: { amount: 59.25, compareAt: 79, showSaving: true } });
    const b = w.get('.q-price__saving');
    expect(b.get('[aria-hidden="true"]').text()).toBe('−25%');
    expect(b.get('.q-visually-hidden').text()).toBe('25% off');
  });

  it('ignores a compareAt that is not higher', () => {
    expect(mount(QPrice, { props: { amount: 59, compareAt: 59, showSaving: true } }).classes()).not.toContain('is-sale');
  });

  it('shows "from", the unit price, the tax note and the size', () => {
    const w = mount(QPrice, { props: { amount: 19.9, from: true, size: 'large', unitPrice: { amount: 4.98, per: '100 ml' }, taxNote: true } });
    expect(w.classes()).toContain('q-price--large');
    expect(w.get('.q-price__from').text()).toBe('from');
    expect(nb(w.get('.q-price__unit').text())).toBe('4,98 € / 100 ml');
    expect(w.get('.q-price__note').text()).toBe('incl. VAT, plus shipping');
  });

  it('takes its own tax note as text or slot, another currency, and translations', () => {
    expect(mount(QPrice, { props: { amount: 5, taxNote: 'zzgl. Versand' } }).get('.q-price__note').text()).toBe('zzgl. Versand');
    const s = mount(QPrice, { props: { amount: 5, currency: 'USD', strings: { from: 'ab' }, from: true }, slots: { 'tax-note': () => h('a', 'Shipping') } });
    expect(s.get('.q-price__note a').text()).toBe('Shipping');
    expect(s.get('.q-price__now').text()).toContain('$');
    expect(s.get('.q-price__from').text()).toBe('ab');
  });
});
