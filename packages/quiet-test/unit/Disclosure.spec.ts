import { mount } from '@vue/test-utils';
import { QDisclosure } from '@frederikhd/quiet';
import { describe, expect, it } from 'vitest';

describe('QDisclosure', () => {
  it('renders a closed h3 heading button that controls the hidden panel', () => {
    const w = mount(QDisclosure, { props: { title: 'Material and care' }, slots: { default: '<p>100% linen</p>' } });
    expect(w.classes()).toEqual(['q-disc']);
    const btn = w.get('h3.q-disc__head > button.q-disc__btn');
    expect(btn.attributes('type')).toBe('button');
    expect(btn.attributes('aria-expanded')).toBe('false');
    const panel = w.get('.q-disc__panel');
    expect(btn.attributes('aria-controls')).toBe(panel.attributes('id'));
    expect(panel.attributes('hidden')).toBeDefined();
    expect(panel.attributes('role')).toBeUndefined();
    expect(w.get('.q-disc__title').text()).toBe('Material and care');
    expect(w.get('.q-disc__chev').attributes('aria-hidden')).toBe('true');
  });

  it('opens and closes on click, emitting update:open', async () => {
    const w = mount(QDisclosure, { props: { title: 'Size' }, slots: { default: 'S M L' } });
    await w.get('button').trigger('click');
    expect(w.get('button').attributes('aria-expanded')).toBe('true');
    expect(w.classes()).toContain('is-open');
    expect(w.get('.q-disc__panel').attributes('hidden')).toBeUndefined();
    expect(w.emitted('update:open')![0]).toEqual([true]);
    await w.get('button').trigger('click');
    expect(w.emitted('update:open')![1]).toEqual([false]);
    expect(w.get('.q-disc__panel').attributes('hidden')).toBeDefined();
  });

  it('follows v-model:open', async () => {
    const w = mount(QDisclosure, { props: { title: 'Size', open: true } });
    expect(w.get('button').attributes('aria-expanded')).toBe('true');
    await w.setProps({ open: false });
    expect(w.get('button').attributes('aria-expanded')).toBe('false');
  });

  it('opens by default with defaultOpen', () => {
    const w = mount(QDisclosure, { props: { title: 'Size', defaultOpen: true } });
    expect(w.get('button').attributes('aria-expanded')).toBe('true');
  });

  it('shows meta only when there is some', () => {
    expect(
      mount(QDisclosure, { props: { title: 'Colour', meta: 'Navy, Sand' } })
        .get('.q-disc__meta')
        .text(),
    ).toBe('Navy, Sand');
    expect(
      mount(QDisclosure, { props: { title: 'Colour', meta: '' } })
        .find('.q-disc__meta')
        .exists(),
    ).toBe(false);
    expect(
      mount(QDisclosure, { props: { title: 'Colour' }, slots: { meta: '<b>2</b>' } })
        .find('.q-disc__meta b')
        .exists(),
    ).toBe(true);
  });

  it('takes a heading level, or none', () => {
    expect(
      mount(QDisclosure, { props: { title: 'A', headingLevel: 2 } })
        .find('h2.q-disc__head')
        .exists(),
    ).toBe(true);
    const none = mount(QDisclosure, { props: { title: 'A', headingLevel: null } });
    expect(none.get('.q-disc__head').element.tagName).toBe('DIV');
  });

  it('names the panel as a region when asked, and drops the divider', () => {
    const w = mount(QDisclosure, { props: { title: 'Delivery', region: true, divider: false } });
    const panel = w.get('.q-disc__panel');
    expect(panel.attributes('role')).toBe('region');
    expect(panel.attributes('aria-labelledby')).toBe(w.get('button').attributes('id'));
    expect(w.classes()).toContain('q-disc--plain');
  });

  it('takes a title slot', () => {
    expect(
      mount(QDisclosure, { slots: { title: '<em>FAQ</em>' } })
        .get('.q-disc__title em')
        .text(),
    ).toBe('FAQ');
  });
});
