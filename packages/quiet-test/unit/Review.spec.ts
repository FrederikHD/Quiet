import { mount } from '@vue/test-utils';
import { QReview, configure } from '@frederikhd/quiet';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';

afterEach(() => configure({ locale: 'en' }));

const review = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(QReview, { props: { rating: 4, author: 'Lea F.', ...props } as never, slots: slots as never });

describe('QReview', () => {
  it('is an article named by its title, with the stars read as words', () => {
    const w = review({ title: 'Runs large' });
    expect(w.element.tagName).toBe('ARTICLE');
    const h3 = w.get('h3.q-review__title');
    expect(w.attributes('aria-labelledby')).toBe(h3.attributes('id'));
    expect(h3.text()).toBe('Runs large');
    expect(w.get('.q-stars').attributes('aria-hidden')).toBe('true');
    expect(w.get('.q-review__rating .q-visually-hidden').text()).toBe('Rated 4 out of 5');
  });

  it('without a title is named by its author, and takes another heading level', () => {
    expect(review().attributes('aria-label')).toBe('Review by Lea F.');
    expect(review({ title: 'Runs large', headingLevel: 4 }).find('h4').exists()).toBe(true);
  });

  it('shows the date in the configured locale, with a machine-readable datetime', () => {
    configure({ locale: 'de-DE' });
    const t = review({ date: new Date(2026, 9, 12) }).get('time');
    expect(t.text()).toBe('12. Oktober 2026');
    expect(t.attributes('datetime')).toMatch(/^2026-10-1[12]$/);
    expect(review({ date: 'vor 2 Wochen' }).get('time').text()).toBe('vor 2 Wochen');
  });

  it('shows verified purchase and what they bought', () => {
    const w = review({ date: '3 Oct 2026', verified: true, details: ['Size M', 'Navy'] });
    expect(w.get('.q-review__verified').text()).toBe('Verified purchase');
    expect(w.get('.q-review__details').text()).toBe('Size M · Navy');
  });

  it('offers Read more only when the folded text has more, and toggles it', async () => {
    const heights = vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(400);
    const client = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(110);
    const w = review({}, { default: () => h('p', 'Long text') });
    await nextTick();
    await nextTick();
    heights.mockRestore();
    client.mockRestore();
    const more = w.get('button.q-review__more');
    const text = w.get('.q-review__text');
    expect(text.classes()).toContain('is-folded');
    expect(more.attributes('aria-expanded')).toBe('false');
    expect(more.attributes('aria-controls')).toBe(text.attributes('id'));
    await more.trigger('click');
    expect(more.text()).toBe('Show less');
    expect(more.attributes('aria-expanded')).toBe('true');
    expect(text.classes()).not.toContain('is-folded');

    const short = review({}, { default: () => h('p', 'Short') });
    await nextTick();
    expect(short.find('button.q-review__more').exists()).toBe(false);
    expect(
      review({ lines: 0 }, { default: () => h('p', 'x') })
        .get('.q-review__text')
        .classes(),
    ).not.toContain('is-folded');
  });

  it('has a Helpful toggle that emits the vote, and the shop reply', async () => {
    const w = review({ helpful: 3, voted: true }, { reply: () => h('p', 'Thank you') });
    const btn = w.get('.q-review__foot button');
    expect(btn.text()).toBe('Helpful (3)');
    expect(btn.attributes('aria-pressed')).toBe('true');
    await btn.trigger('click');
    expect(w.emitted('vote')).toEqual([[false]]);
    expect(w.get('.q-review__reply-title').text()).toBe('Reply from the shop');
    expect(review().find('.q-review__foot').exists()).toBe(false);
  });

  it('takes its own strings', () => {
    const w = review({
      strings: { rated: (n: number) => `${n} von 5 Sternen`, by: (a: string) => `Bewertung von ${a}` },
    });
    expect(w.attributes('aria-label')).toBe('Bewertung von Lea F.');
    expect(w.get('.q-review__rating .q-visually-hidden').text()).toBe('4 von 5 Sternen');
  });
});
