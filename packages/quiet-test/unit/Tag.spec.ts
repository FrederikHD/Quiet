import { mount } from '@vue/test-utils';
import { configure, QTag } from '@frederikhd/quiet';
import { afterEach, describe, expect, it } from 'vitest';
import { h } from 'vue';

describe('QTag', () => {
  afterEach(() => configure({ strings: { tag: { remove: (l: string) => `Remove ${l}` } } }));

  it('renders a plain pill that is not a button', () => {
    const w = mount(QTag, { slots: { default: 'Summer linen' } });
    expect(w.element.tagName).toBe('SPAN');
    expect(w.classes()).toEqual(['q-tag']);
    expect(w.get('.q-tag__label').text()).toBe('Summer linen');
    expect(w.find('button').exists()).toBe(false);
  });

  it('shows a swatch, an icon and a detail', () => {
    const w = mount(QTag, { props: { swatch: 'navy', icon: 'tag', detail: '−10 %' }, slots: { default: 'LINEN10' } });
    const dot = w.get('.q-tag__dot');
    expect(dot.attributes('aria-hidden')).toBe('true');
    expect(dot.attributes('style')).toContain('--q-swatch: navy');
    expect(w.get('.q-lead').attributes('aria-hidden')).toBe('true');
    expect(w.get('.q-tag__detail').text()).toBe('−10 %');
  });

  it('is one button when a removable pill, named "Remove <text>"', async () => {
    const w = mount(QTag, { props: { removable: true }, slots: { default: 'Navy' } });
    const b = w.get('button.q-tag');
    expect(b.attributes('type')).toBe('button');
    expect(b.classes()).toContain('q-tag--removable');
    expect(b.attributes('aria-label')).toBe('Remove Navy');
    expect(b.find('.q-tag__x').exists()).toBe(true);
    await b.trigger('click');
    expect(w.emitted('remove')).toHaveLength(1);
  });

  it('keeps the visible text in the button name (label in name), detail included', () => {
    const own = mount(QTag, {
      props: { removable: true, removeLabel: 'Remove discount LINEN10', detail: '−10 %', icon: 'tag' },
      slots: { default: 'LINEN10' },
    });
    expect(own.get('button').attributes('aria-label')).toBe('Remove discount LINEN10 −10 %');
    const auto = mount(QTag, {
      props: { removable: true },
      slots: { default: 'LINEN10', detail: () => h('span', '−10 %') },
    });
    expect(auto.get('button').attributes('aria-label')).toBe('Remove LINEN10 −10 %');
    expect(auto.get('.q-tag__detail span').text()).toBe('−10 %');
    const named = mount(QTag, {
      props: { removable: true, removeLabel: 'Remove filter: Navy' },
      slots: { default: 'Navy' },
    });
    expect(named.get('button').attributes('aria-label')).toBe('Remove filter: Navy');
  });

  it('disables a removable pill', async () => {
    const w = mount(QTag, { props: { removable: true, disabled: true }, slots: { default: 'Navy' } });
    const b = w.get('button');
    expect(b.attributes('disabled')).toBeDefined();
    expect(b.classes()).toContain('is-disabled');
  });

  it('gives a field tag its own small ×', async () => {
    const w = mount(QTag, { props: { variant: 'field', removable: true, detail: '2' }, slots: { default: 'Gifts' } });
    expect(w.element.tagName).toBe('SPAN');
    expect(w.classes()).toEqual(expect.arrayContaining(['q-tag', 'q-tag--field', 'q-tag--removable']));
    const x = w.get('button.q-tag__remove');
    expect(x.attributes('aria-label')).toBe('Remove Gifts');
    await x.trigger('click');
    expect(w.emitted('remove')).toHaveLength(1);
  });

  it('drops the field tag × when disabled', () => {
    const w = mount(QTag, {
      props: { variant: 'field', removable: true, disabled: true },
      slots: { default: 'Gifts' },
    });
    expect(w.find('button').exists()).toBe(false);
    expect(w.classes()).toContain('is-disabled');
  });

  it('translates the remove name through configure() and the strings prop', () => {
    configure({ strings: { tag: { remove: (l: string) => `${l} entfernen` } } });
    expect(
      mount(QTag, { props: { removable: true }, slots: { default: 'Navy' } })
        .get('button')
        .attributes('aria-label'),
    ).toBe('Navy entfernen');
    const own = mount(QTag, {
      props: { removable: true, strings: { remove: (l: string) => `Drop ${l}` } },
      slots: { default: 'Navy' },
    });
    expect(own.get('button').attributes('aria-label')).toBe('Drop Navy');
  });

  it('puts class and attributes on the tag', () => {
    const w = mount(QTag, {
      props: { removable: true },
      attrs: { class: 'mine', 'data-k': 'navy' },
      slots: { default: 'Navy' },
    });
    expect(w.get('button').classes()).toContain('mine');
    expect(w.get('button').attributes('data-k')).toBe('navy');
  });
});
