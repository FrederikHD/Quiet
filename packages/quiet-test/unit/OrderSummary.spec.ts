import { enableAutoUnmount, mount } from '@vue/test-utils';
import { QOrderSummary, configure } from 'quiet';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { h } from 'vue';

enableAutoUnmount(afterEach);
beforeAll(() => configure({ locale: 'en-US', currency: 'EUR' }));

const items = [
  { id: 'a', name: 'Linen shirt', variant: 'Blue · M', quantity: 2, price: 118, image: { src: 'a.jpg' }, href: '#a' },
  null,
  { id: 'b', name: 'Linen trousers', price: 79, compareAt: 99 },
];
const summary = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(QOrderSummary, { props: { items, total: 201.9, ...props } as never, slots: slots as never, attachTo: document.body });

describe('QOrderSummary', () => {
  it('is a section titled "Order summary" with the item count', () => {
    const w = summary();
    expect(w.element.tagName).toBe('SECTION');
    const t = w.get('h2.q-summary__title');
    expect(w.attributes('aria-labelledby')).toBe(t.attributes('id'));
    expect(t.text()).toBe('Order summary3 items');
    expect(t.get('.q-summary__count').text()).toBe('3 items');
  });

  it('lists the lines with quantity, variant, link and price', () => {
    const w = summary();
    const lines = w.findAll('.q-summary__line');
    expect(lines).toHaveLength(2);
    expect(lines[0].get('.q-summary__qty').text()).toBe('2');
    expect(lines[0].get('.q-summary__qty').attributes('aria-hidden')).toBe('true');
    expect(lines[0].get('a.q-summary__name').attributes('href')).toBe('#a');
    expect(lines[0].get('.q-summary__variant').text()).toBe('Blue · M');
    expect(lines[0].get('.q-visually-hidden').text()).toBe('Quantity 2');
    expect(lines[0].get('img').attributes('alt')).toBe('');
    expect(lines[1].find('.q-summary__qty').exists()).toBe(false);
    expect(lines[1].find('svg.q-icon').exists()).toBe(true);
    expect(lines[1].get('.q-price').classes()).toContain('is-sale');
    expect(summary({ showQuantity: 'always' }).findAll('.q-summary__qty')).toHaveLength(2);
  });

  it('shows subtotal, the extra rows and the total', () => {
    const w = summary({
      totals: [
        { label: 'Discount', detail: 'LINEN10', amount: -10 },
        { label: 'Shipping', amount: 0 },
        { label: 'Express', amount: 0, free: false },
        { label: 'Tax', amount: null, note: 'Next step' },
        false,
      ],
      taxNote: 'Including 32,24 € VAT',
    });
    const dl = w.get('dl.q-summary__totals');
    expect(dl.classes()).toContain('q-dl--inline');
    const rows = dl.findAll('.q-dl__item');
    expect(rows.map((r) => r.get('dt').text())).toEqual(['Subtotal', 'DiscountLINEN10', 'Shipping', 'Express', 'Tax', 'Total']);
    const dd = rows.map((r) => r.get('dd').text().replace(/\s/g, ' '));
    expect(dd).toEqual(['€197.00', '−€10.00', 'Free', '€0.00', 'Next step', '€201.90']);
    expect(rows[1].find('.q-summary__minus').exists()).toBe(true);
    expect(rows[4].find('.q-summary__pending').exists()).toBe(true);
    expect(rows[5].classes()).toContain('q-dl__item--emphasis');
    expect(w.get('.q-summary__note').text()).toBe('Including 32,24 € VAT');
    expect(summary({ subtotal: 150 }).get('dd').text()).toBe('€150.00');
  });

  it('puts the default slot between the lines and the totals, and takes a tax-note slot', () => {
    const w = summary({}, { default: () => h('form', { class: 'code' }), 'tax-note': () => h('a', { href: '#vat' }, 'VAT') });
    const extra = w.get('.q-summary__extra');
    expect(extra.find('form.code').exists()).toBe(true);
    expect(extra.element.previousElementSibling?.classList.contains('q-summary__lines')).toBe(true);
    expect(w.get('.q-summary__note a').text()).toBe('VAT');
  });

  it('drops its own heading with title null and uses a custom title and level', () => {
    const n = summary({ title: null });
    expect(n.element.tagName).toBe('DIV');
    expect(n.find('.q-summary__title').exists()).toBe(false);
    expect(summary({ title: 'Your order', headingLevel: 3 }).get('h3.q-summary__title').text()).toContain('Your order');
  });

  it('folds into a disclosure with the total, toggled by its button', async () => {
    const w = summary({ collapsible: true });
    expect(w.classes()).toContain('q-summary--folds');
    expect(w.attributes('aria-label')).toBe('Order summary');
    const btn = w.get('button.q-disc__btn');
    expect(btn.attributes('aria-expanded')).toBe('false');
    expect(btn.text()).toContain('Show order summary');
    expect(btn.get('.q-disc__meta').text()).toBe('€201.90');
    expect(w.get('.q-disc__panel').attributes('hidden')).toBeDefined();
    await btn.trigger('click');
    expect(w.emitted('update:open')![0]).toEqual([true]);
    expect(btn.attributes('aria-expanded')).toBe('true');
    expect(btn.text()).toContain('Hide order summary');
    expect(w.classes()).toContain('is-open');
  });

  it('starts open with defaultOpen and takes translations', () => {
    const w = summary({ collapsible: true, defaultOpen: true, strings: { hide: 'Zuklappen' } });
    expect(w.get('button.q-disc__btn').attributes('aria-expanded')).toBe('true');
    expect(w.get('button.q-disc__btn').text()).toContain('Zuklappen');
  });

  it('does not fold with collapsible="auto" on a wide screen', () => {
    expect(summary({ collapsible: 'auto' }).classes()).not.toContain('q-summary--folds');
  });
});
