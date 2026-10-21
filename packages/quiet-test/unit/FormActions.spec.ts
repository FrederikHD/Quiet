import { mount } from '@vue/test-utils';
import { QButton, QFormActions } from '@frederikhd/quiet';
import { describe, expect, it, vi } from 'vitest';
import { h } from 'vue';

describe('QFormActions', () => {
  it('puts its buttons in a row aligned to the end', () => {
    const w = mount(QFormActions, {
      slots: { default: () => [h(QButton, null, () => 'Cancel'), h(QButton, { variant: 'primary' }, () => 'Save')] },
    });
    expect(w.classes()).toEqual(['q-factions']);
    const row = w.get('.q-factions__row');
    expect(row.classes()).toContain('q-factions__row--end');
    expect(row.findAll('.q-btn').map((b) => b.text())).toEqual(['Cancel', 'Save']);
  });

  it.each(['start', 'between'] as const)('aligns %s', (align) => {
    const w = mount(QFormActions, { props: { align } });
    expect(w.get('.q-factions__row').classes()).toContain(`q-factions__row--${align}`);
  });

  it('can stick to the bottom', async () => {
    const w = mount(QFormActions, { attachTo: document.body, props: { sticky: true } });
    expect(w.classes()).toContain('q-factions--sticky');
    await w.setProps({ sticky: false });
    expect(w.classes()).not.toContain('q-factions--sticky');
    w.unmount();
  });

  it('passes class and attributes to the root', () => {
    const w = mount(QFormActions, { attrs: { class: 'extra', 'data-test': 'x' } });
    expect(w.classes()).toContain('extra');
    expect(w.attributes('data-test')).toBe('x');
  });
});

describe('QFormActions (audit fixes)', () => {
  it('pads the scrolling box it sits in, and takes the padding away again', async () => {
    const box = document.createElement('div');
    box.style.overflowY = 'auto';
    document.body.append(box);
    const w = mount(QFormActions, { attachTo: box, props: { sticky: true } });
    const spy = vi.spyOn(w.element, 'getBoundingClientRect').mockReturnValue({ height: 56 } as DOMRect);
    await w.setProps({ sticky: false });
    await w.setProps({ sticky: true });
    expect(box.style.scrollPaddingBottom).toBe('64px');
    spy.mockRestore();
    w.unmount();
    expect(box.style.scrollPaddingBottom).toBe('');
  });
});
