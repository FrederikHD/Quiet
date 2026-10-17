import { mount } from '@vue/test-utils';
import { QProductCard, configure } from 'quiet';
import { beforeAll, describe, expect, it } from 'vitest';

beforeAll(() => configure({ locale: 'en-US', currency: 'EUR' }));
const card = (props: Record<string, unknown> = {}) =>
  mount(QProductCard, { props: { name: 'Linen shirt', href: '#shirt', price: 59, image: { src: 'shirt.jpg' }, ...props } as never });

describe('QProductCard', () => {
  it('is an article named by its heading, with one link', () => {
    const w = card();
    expect(w.element.tagName).toBe('ARTICLE');
    const h = w.get('h3.q-pcard__name');
    expect(w.attributes('aria-labelledby')).toBe(h.attributes('id'));
    expect(w.findAll('a')).toHaveLength(1);
    expect(h.get('a.q-pcard__link').attributes('href')).toBe('#shirt');
    expect(h.text()).toBe('Linen shirt');
    const img = w.get('img.q-pcard__img');
    expect(img.attributes('alt')).toBe('');
    expect(img.attributes('loading')).toBe('lazy');
    expect(w.get('.q-price').classes()).toContain('q-price--small');
  });

  it('shows a placeholder without an image, and a decorative hover image', () => {
    expect(card({ image: undefined }).get('.q-pcard__placeholder').attributes('aria-hidden')).toBe('true');
    const hv = card({ hoverImage: { src: 'back.jpg' } }).get('.q-pcard__img--hover');
    expect(hv.attributes('aria-hidden')).toBe('true');
    expect(hv.attributes('alt')).toBe('');
  });

  it('shows vendor, sale price, price from, rating, badges and the heading level', () => {
    const w = card({
      vendor: 'Leinenweberei Rhön',
      compareAt: 79,
      priceFrom: true,
      rating: { value: 4.5, count: 12 },
      badges: [{ label: 'Sale', tone: 'sale' }, null, { label: 'New' }],
      headingLevel: 2,
    });
    expect(w.get('.q-pcard__vendor').text()).toBe('Leinenweberei Rhön');
    expect(w.get('.q-price').classes()).toContain('is-sale');
    expect(w.find('.q-price__from').exists()).toBe(true);
    expect(w.find('.q-rating').exists()).toBe(true);
    const badges = w.findAll('.q-pcard__badges .q-badge');
    expect(badges.map((b) => b.text())).toEqual(['Sale', 'New']);
    expect(badges[1].classes()).toContain('q-badge--neutral');
    expect(w.find('h2.q-pcard__name').exists()).toBe(true);
    expect(card({ rating: { value: 0, count: 0 } }).find('.q-rating').exists()).toBe(false);
  });

  it('lists the colours for screen readers and caps the dots', () => {
    const swatches = ['Navy', 'Sand', 'Olive'].map((label) => ({ label, color: '#000' }));
    const w = card({ swatches, maxSwatches: 2 });
    expect(w.get('.q-pcard__swatches .q-visually-hidden').text()).toBe('3 colours: Navy, Sand, Olive');
    expect(w.findAll('.q-pcard__dot')).toHaveLength(2);
    expect(w.get('.q-pcard__dot').attributes('aria-hidden')).toBe('true');
    expect(w.get('.q-pcard__more').text()).toBe('+1');
  });

  it('adds a named quick add button that emits quick-add, hidden when sold out', async () => {
    const w = card({ quickAdd: true });
    const btn = w.get('button.q-pcard__quick');
    expect(btn.attributes('aria-label')).toBe('Add Linen shirt to cart');
    await btn.trigger('click');
    expect(w.emitted('quick-add')).toHaveLength(1);
    const sold = card({ quickAdd: true, soldOut: true, aspect: 'square' });
    expect(sold.classes()).toEqual(expect.arrayContaining(['is-soldout', 'q-pcard--square']));
    expect(sold.find('.q-pcard__quick').exists()).toBe(false);
  });

  it('passes class and attributes to the article (a single root)', () => {
    const w = mount(QProductCard, { props: { name: 'Linen shirt' }, attrs: { class: 'extra', 'data-x': '1' } });
    expect(w.element.tagName).toBe('ARTICLE');
    expect(w.classes()).toContain('extra');
    expect(w.attributes('data-x')).toBe('1');
  });

  it('emits navigate on a link click', async () => {
    const w = card();
    await w.get('a').trigger('click');
    expect(w.emitted('navigate')).toHaveLength(1);
  });
});
