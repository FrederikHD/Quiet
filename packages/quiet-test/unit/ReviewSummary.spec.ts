import { mount } from '@vue/test-utils';
import { QReviewSummary, configure } from 'quiet';
import { beforeAll, describe, expect, it } from 'vitest';
import { h } from 'vue';

beforeAll(() => configure({ locale: 'en-US' }));
const distribution = { 5: 20, 4: 7, 3: 2, 2: 0, 1: 2 };

describe('QReviewSummary', () => {
  it('shows the average, the stars, the count and a bar per level', () => {
    const w = mount(QReviewSummary, { props: { average: 4.3, distribution } });
    expect(w.get('.q-rsum__avg').text()).toBe('4.3 out of 5');
    expect(w.get('.q-rsum__avg .q-visually-hidden').element.textContent).toBe(' out of 5');
    expect(w.get('.q-rsum__count').text()).toBe('31 reviews');
    expect(w.get('.q-stars').classes()).toContain('q-stars--md');
    const bars = w.get('ul.q-rsum__bars');
    expect(bars.attributes('aria-label')).toBe('Reviews by rating');
    const rows = bars.findAll('li');
    expect(rows).toHaveLength(5);
    expect(rows[0].get('.q-rsum__bar > span').attributes('style')).toContain('width: 100%');
    expect(rows[1].get('.q-rsum__bar > span').attributes('style')).toContain('width: 35%');
    expect(rows[0].get('.q-visually-hidden').text()).toBe('20 reviews — 5 stars');
    expect(w.find('button').exists()).toBe(false);
  });

  it('uses count when given', () => {
    expect(mount(QReviewSummary, { props: { average: 4, distribution, count: 1 } }).get('.q-rsum__count').text()).toBe('1 review');
  });

  it('makes the bars toggle buttons named by their visible content when filterable', async () => {
    const w = mount(QReviewSummary, { props: { average: 4.3, distribution, filterable: true } });
    const btns = w.findAll('button.q-rsum__row');
    expect(btns).toHaveLength(5);
    const five = btns[0];
    // No aria-label: the name comes from the content, so it contains the visible level and count (label in name).
    expect(five.attributes('aria-label')).toBeUndefined();
    expect(five.get('.q-visually-hidden').text()).toBe('5 stars, 20 reviews');
    expect(five.attributes('aria-pressed')).toBe('false');
    expect(btns[3].attributes('disabled')).toBeDefined();
    await five.trigger('click');
    expect(w.emitted('filter')![0]).toEqual([5]);
  });

  it('marks the active level pressed and clears it on a second press', async () => {
    const w = mount(QReviewSummary, { props: { average: 4.3, distribution, filterable: true, active: 4 } });
    const four = w.findAll('button.q-rsum__row')[1];
    expect(four.attributes('aria-pressed')).toBe('true');
    expect(four.classes()).toContain('is-active');
    await four.trigger('click');
    expect(w.emitted('filter')![0]).toEqual([null]);
  });

  it('renders the action slot and takes translations', () => {
    const w = mount(QReviewSummary, {
      props: { average: 4, distribution, strings: { reviews: (n: number) => `${n} Bewertungen` } },
      slots: { action: () => h('button', 'Write a review') },
    });
    expect(w.get('.q-rsum__action button').text()).toBe('Write a review');
    expect(w.get('.q-rsum__count').text()).toBe('31 Bewertungen');
  });

  it('translates the star level of plain rows through the shared rating strings', () => {
    configure({ strings: { rating: { stars: (n: number) => `${n} Sterne` } } });
    try {
      const w = mount(QReviewSummary, { props: { average: 4.3, distribution } });
      expect(w.findAll('li')[0].get('.q-visually-hidden').text()).toBe('20 reviews — 5 Sterne');
    } finally {
      configure({ strings: { rating: { stars: (n: number) => `${n} ${n === 1 ? 'star' : 'stars'}` } } });
    }
  });
});
