import { mount } from '@vue/test-utils';
import { QButton, QFormActions } from '@frederikhd/quiet';
import { describe, expect, it } from 'vitest';
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
