import { mount } from '@vue/test-utils';
import { QRating, configure } from '@frederikhd/quiet';
import { beforeAll, describe, expect, it, vi } from 'vitest';

beforeAll(() => configure({ locale: 'en-US' }));

describe('QRating', () => {
  it('shows part-filled stars, the value and the count, read as one phrase', () => {
    const w = mount(QRating, { props: { value: 4.6, count: 128 } });
    expect(w.element.tagName).toBe('SPAN');
    expect(w.classes()).toEqual(['q-rating']);
    expect(w.get('.q-stars').attributes('aria-hidden')).toBe('true');
    const fills = w.findAll('.q-star__fill');
    expect(fills).toHaveLength(5);
    expect(parseFloat(fills[4].attributes('style')!.replace('width:', ''))).toBeCloseTo(60);
    expect(w.get('.q-rating__value').text()).toBe('4.6');
    expect(w.get('.q-rating__count').text()).toBe('(128)');
    expect(w.get('.q-visually-hidden').text()).toBe('Rated 4.6 out of 5, 128 reviews');
  });

  it('says "No reviews yet" without any', () => {
    const w = mount(QRating, { props: { value: 0, count: 0 } });
    expect(w.get('.q-rating__none').text()).toBe('No reviews yet');
    expect(w.findAll('.q-star__fill')).toHaveLength(0);
  });

  it('hides the value with showValue false and applies sizes', () => {
    const w = mount(QRating, { props: { value: 4, showValue: false, size: 'small' } });
    expect(w.find('.q-rating__value').exists()).toBe(false);
    expect(w.classes()).toContain('q-rating--small');
    expect(w.get('.q-visually-hidden').text()).toBe('Rated 4.0 out of 5');
    expect(mount(QRating, { props: { value: 4, size: 'large' } }).classes()).toContain('q-rating--large');
  });

  it('becomes a link with href, or with a click handler', async () => {
    const a = mount(QRating, { props: { value: 4.3, count: 31, href: '#reviews' } });
    expect(a.element.tagName).toBe('A');
    expect(a.attributes('href')).toBe('#reviews');
    expect(a.classes()).toContain('q-rating--link');
    const onClick = vi.fn((e: MouseEvent) => e.preventDefault());
    const b = mount(QRating, { props: { value: 4.3, onClick } });
    expect(b.element.tagName).toBe('A');
    expect(b.attributes('href')).toBe('#');
    await b.trigger('click');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('takes translations', () => {
    const w = mount(QRating, { props: { value: 4, count: 1, strings: { label: (v: string) => `Bewertung ${v}` } } });
    expect(w.get('.q-visually-hidden').text()).toBe('Bewertung 4.0');
  });
});
