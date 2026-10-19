import { mount } from '@vue/test-utils';
import { QIcon, QInput } from '@frederikhd/quiet';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';

describe('QInput', () => {
  it('renders the box with a native text input and passes attributes through', () => {
    const w = mount(QInput, {
      attrs: { 'aria-label': 'Name', placeholder: 'e.g. Linen', autocomplete: 'off', class: 'mine' },
    });
    expect(w.get('span').classes()).toEqual(expect.arrayContaining(['q-input', 'mine']));
    const input = w.get('input.q-input__field');
    expect(input.attributes('type')).toBe('text');
    expect(input.attributes('placeholder')).toBe('e.g. Linen');
    expect(input.attributes('aria-label')).toBe('Name');
    expect(input.classes()).not.toContain('mine');
  });

  it('sets size, alignment, numeric and state classes', () => {
    const w = mount(QInput, {
      props: { size: 'large', align: 'end', numeric: true, invalid: true, readonly: true },
      attrs: { 'aria-label': 'Price' },
    });
    expect(w.get('.q-input').classes()).toEqual(
      expect.arrayContaining([
        'q-input--large',
        'q-input--end',
        'q-input--numeric',
        'q-input--invalid',
        'q-input--readonly',
      ]),
    );
    expect(w.get('input').attributes('aria-invalid')).toBe('true');
    expect(w.get('input').attributes('readonly')).toBeDefined();
  });

  it('treats aria-invalid as invalid', () => {
    const w = mount(QInput, { attrs: { 'aria-label': 'x', 'aria-invalid': 'true' } });
    expect(w.get('.q-input').classes()).toContain('q-input--invalid');
  });

  it('shows prefix and suffix text and slots', () => {
    const w = mount(QInput, {
      props: { suffix: 'kg' },
      slots: { prefix: () => h(QIcon, { name: 'search' }) },
      attrs: { 'aria-label': 'w' },
    });
    expect(w.get('.q-input__affix--end').text()).toBe('kg');
    expect(w.find('.q-input__affix--start svg').exists()).toBe(true);
  });

  it('focuses the field when an affix is pressed', async () => {
    const w = mount(QInput, { props: { suffix: '€' }, attrs: { 'aria-label': 'Price' }, attachTo: document.body });
    await w.get('.q-input__affix').trigger('mousedown');
    expect(document.activeElement).toBe(w.get('input').element);
    w.unmount();
  });

  it('applies v-model modifiers', async () => {
    const w = mount(QInput, {
      props: { modelValue: '', modelModifiers: { trim: true } },
      attrs: { 'aria-label': 'x' },
    });
    await w.get('input').setValue('  Linen ');
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['Linen']);
    const n = mount(QInput, {
      props: { modelValue: null, modelModifiers: { number: true } },
      attrs: { 'aria-label': 'x' },
    });
    await n.get('input').setValue('42');
    expect(n.emitted('update:modelValue')?.at(-1)).toEqual([42]);
  });

  it('clears, emits clear and refocuses; the clear button has a translatable name', async () => {
    const w = mount(QInput, {
      props: { modelValue: 'abc', clearable: true, clearLabel: 'Leeren' },
      attrs: { 'aria-label': 'Search' },
      attachTo: document.body,
    });
    const btn = w.get('button.q-input__clear');
    expect(btn.attributes('aria-label')).toBe('Leeren');
    expect(btn.attributes('type')).toBe('button');
    await btn.trigger('click');
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['']);
    expect(w.emitted('clear')).toHaveLength(1);
    expect(document.activeElement).toBe(w.get('input').element);
    w.unmount();
  });

  it('hides the clear button when empty, disabled or read-only', async () => {
    const w = mount(QInput, { props: { modelValue: '', clearable: true }, attrs: { 'aria-label': 'x' } });
    expect(w.find('.q-input__clear').exists()).toBe(false);
    await w.setProps({ modelValue: 'a', disabled: true });
    expect(w.find('.q-input__clear').exists()).toBe(false);
    await w.setProps({ disabled: false, readonly: true });
    expect(w.find('.q-input__clear').exists()).toBe(false);
    await w.setProps({ readonly: false });
    expect(w.find('.q-input__clear').exists()).toBe(true);
  });

  it('exposes focus()', () => {
    const w = mount(QInput, { attrs: { 'aria-label': 'x' }, attachTo: document.body });
    (w.vm as unknown as { focus: () => void }).focus();
    expect(document.activeElement).toBe(w.get('input').element);
    w.unmount();
  });
});
