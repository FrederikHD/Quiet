import { mount } from '@vue/test-utils';
import { QCard } from 'quiet';
import { describe, expect, it } from 'vitest';

describe('QCard', () => {
  it('is a plain section with a body when it has no title', () => {
    const w = mount(QCard, { slots: { default: '4.210 €' } });
    expect(w.element.tagName).toBe('SECTION');
    expect(w.classes()).toEqual(['q-card']);
    expect(w.attributes('aria-labelledby')).toBeUndefined();
    expect(w.find('.q-card__header').exists()).toBe(false);
    expect(w.get('.q-card__body').text()).toBe('4.210 €');
    expect(w.find('.q-card__footer').exists()).toBe(false);
  });

  it('is named by its h2 title and shows the description', () => {
    const w = mount(QCard, { props: { title: 'Notes', description: 'Only your team sees these.' } });
    const h2 = w.get('h2.q-card__title');
    expect(h2.text()).toBe('Notes');
    expect(w.attributes('aria-labelledby')).toBe(h2.attributes('id'));
    expect(w.get('.q-card__desc').text()).toBe('Only your team sees these.');
  });

  it('takes a heading level', () => {
    expect(mount(QCard, { props: { title: 'Notes', headingLevel: 3 } }).find('h3.q-card__title').exists()).toBe(true);
  });

  it('takes title and description slots', () => {
    const w = mount(QCard, { slots: { title: '<em>Notes</em>', description: '<a href="#">Help</a>' } });
    expect(w.get('h2 em').text()).toBe('Notes');
    expect(w.attributes('aria-labelledby')).toBeDefined();
    expect(w.get('.q-card__desc a').text()).toBe('Help');
  });

  it('shows actions on the title line, even without a title, and a footer', () => {
    const w = mount(QCard, { slots: { actions: '<button>Edit</button>', footer: '<button>Save</button>' } });
    expect(w.get('.q-card__header .q-card__actions button').text()).toBe('Edit');
    expect(w.find('.q-card__title').exists()).toBe(false);
    expect(w.get('.q-card__footer button').text()).toBe('Save');
  });

  it('flush', () => {
    expect(mount(QCard, { props: { flush: true } }).classes()).toContain('q-card--flush');
  });
});
