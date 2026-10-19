import { mount } from '@vue/test-utils';
import { QRadio, QRadioGroup } from '@frederikhd/quiet';
import { describe, expect, it, vi } from 'vitest';
import { h } from 'vue';

const inGroup = (
  radio: Record<string, unknown>,
  group: Record<string, unknown> = {},
  slots: Record<string, () => unknown> = {},
) =>
  mount(QRadioGroup, {
    props: { label: 'Delivery', ...group },
    slots: { default: () => h(QRadio, { value: 'exp', label: 'Express', ...radio }, slots) },
  });

describe('QRadio', () => {
  it('is a native radio inside a label row', () => {
    const w = inGroup({ description: 'Next working day', meta: '9,90 €' });
    const row = w.get('label.q-choice');
    expect(row.classes()).toContain('q-choice--radio');
    const input = row.get('input');
    expect(input.attributes('type')).toBe('radio');
    expect(input.classes()).toContain('q-choice__input');
    expect(input.attributes('value')).toBe('exp');
    expect(row.get('.q-choice__label').text()).toBe('Express');
    expect(row.get('.q-choice__desc').text()).toBe('Next working day');
    expect(row.get('.q-choice__meta').text()).toBe('9,90 €');
    expect(row.find('.q-choice__mark').exists()).toBe(false);
  });

  it('leaves out description and meta when not given', () => {
    const w = inGroup({});
    expect(w.find('.q-choice__desc').exists()).toBe(false);
    expect(w.find('.q-choice__meta').exists()).toBe(false);
    expect(w.find('.q-choice__media').exists()).toBe(false);
  });

  it('takes slots for label, description, meta and decorative media', () => {
    const w = inGroup(
      { label: undefined },
      { layout: 'cards' },
      {
        label: () => h('strong', 'Card'),
        description: () => 'Debit or credit',
        meta: () => 'Free',
        media: () => h('svg'),
      },
    );
    expect(w.get('.q-choice__label strong').text()).toBe('Card');
    expect(w.get('.q-choice__desc').text()).toBe('Debit or credit');
    expect(w.get('.q-choice__meta').text()).toBe('Free');
    expect(w.get('.q-choice__media').attributes('aria-hidden')).toBe('true');
    expect(w.get('.q-choice').classes()).toContain('q-choice--card');
  });

  it('is a card on its own with card, or not when card is false in a cards group', () => {
    expect(inGroup({ card: true }).get('.q-choice').classes()).toContain('q-choice--card');
    expect(inGroup({ card: false }, { layout: 'cards' }).get('.q-choice').classes()).not.toContain('q-choice--card');
  });

  it('can be disabled or invalid on its own', () => {
    const w = inGroup({ disabled: true, invalid: true });
    expect(w.get('.q-choice').classes()).toEqual(expect.arrayContaining(['is-disabled', 'is-invalid']));
    expect(w.get('input').attributes('disabled')).toBeDefined();
  });

  it('passes attributes to the input, and class to the row', () => {
    const w = inGroup({ class: 'extra', 'data-test': 'x', 'aria-describedby': 'own', id: 'r1' }, { hint: 'Pick one' });
    expect(w.get('.q-choice').classes()).toContain('extra');
    const input = w.get('input');
    expect(input.attributes('data-test')).toBe('x');
    expect(input.attributes('id')).toBe('r1');
    expect(input.attributes('aria-describedby')).toBe(`own ${w.get('.q-field__hint').attributes('id')}`);
    expect(input.classes()).not.toContain('extra');
  });

  it('calls its own change listener as well as choosing in the group', async () => {
    const onChange = vi.fn();
    const w = inGroup({ onChange });
    await w.get('input').setValue(true);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual(['exp']);
  });

  it('exposes focus()', () => {
    const w = mount(QRadioGroup, {
      attachTo: document.body,
      props: { label: 'D' },
      slots: { default: () => h(QRadio, { value: 'a', label: 'A' }) },
    });
    (w.findComponent(QRadio).vm as unknown as { focus(): void }).focus();
    expect(document.activeElement).toBe(w.get('input').element);
    w.unmount();
  });

  it('warns outside a RadioGroup', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const w = mount(QRadio, { props: { value: 'a', label: 'A', name: 'own' } });
    expect(w.get('input').attributes('name')).toBe('own');
    expect(warn.mock.calls.some(([m]) => String(m).includes('Radio: put radios inside a RadioGroup'))).toBe(true);
  });
});
