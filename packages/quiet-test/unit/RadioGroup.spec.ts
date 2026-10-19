import { mount, type VueWrapper } from '@vue/test-utils';
import { QForm, QRadio, QRadioGroup } from '@frederikhd/quiet';
import { describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';

const options = () => [
  h(QRadio, { value: 'std', label: 'Standard' }),
  h(QRadio, { value: 'exp', label: 'Express' }),
  h(QRadio, { value: 'pick', label: 'Pick up', disabled: true }),
];
const checked = (w: ReturnType<typeof mount>) => w.findAll('input').map((i) => (i.element as HTMLInputElement).checked);

describe('QRadioGroup', () => {
  it('is a labelled radiogroup with one name', () => {
    const w = mount(QRadioGroup, { props: { label: 'Delivery', name: 'ship' }, slots: { default: options } });
    const root = w.get('.q-choicegroup');
    expect(root.attributes('role')).toBe('radiogroup');
    expect(w.get(`#${root.attributes('aria-labelledby')}`).text()).toBe('Delivery');
    for (const i of w.findAll('input')) {
      expect(i.attributes('type')).toBe('radio');
      expect(i.attributes('name')).toBe('ship');
    }
  });

  it('marks the radiogroup required and invalid', () => {
    const w = mount(QRadioGroup, { props: { label: 'Delivery', required: true, error: 'Choose a delivery method' }, slots: { default: options } });
    const root = w.get('.q-choicegroup');
    expect(root.attributes('aria-required')).toBe('true');
    expect(root.attributes('aria-invalid')).toBe('true');
    const msgId = w.get('.q-field__msg--error').attributes('id');
    for (const i of w.findAll('input')) expect(i.attributes('aria-describedby')).toBe(msgId);
    expect(w.findAll('.q-choice.is-invalid')).toHaveLength(3);
  });

  it('follows v-model and emits the chosen value', async () => {
    const w: VueWrapper = mount(QRadioGroup, {
      props: { label: 'Delivery', modelValue: 'std', 'onUpdate:modelValue': (v?: string | null) => w.setProps({ modelValue: v }) },
      slots: { default: options },
    });
    expect(checked(w)).toEqual([true, false, false]);
    await w.findAll('input')[1].setValue(true);
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual(['exp']);
    expect(checked(w)).toEqual([false, true, false]);
  });

  it('starts from defaultValue, or none', () => {
    expect(checked(mount(QRadioGroup, { props: { label: 'D', defaultValue: 'exp' }, slots: { default: options } }))).toEqual([false, true, false]);
    expect(checked(mount(QRadioGroup, { props: { label: 'D' }, slots: { default: options } }))).toEqual([false, false, false]);
  });

  it('puts its id on the chosen radio, or on the first enabled one', async () => {
    const w = mount(QRadioGroup, { props: { label: 'Delivery', id: 'co-ship' }, slots: { default: options } });
    expect(w.get('#co-ship').attributes('value')).toBe('std');
    await w.setProps({ modelValue: 'exp' });
    expect(w.get('#co-ship').attributes('value')).toBe('exp');
  });

  it('disables every radio', () => {
    const w = mount(QRadioGroup, { props: { label: 'D', disabled: true }, slots: { default: options } });
    for (const i of w.findAll('input')) expect(i.attributes('disabled')).toBeDefined();
    expect(w.findAll('.q-choice.is-disabled')).toHaveLength(3);
  });

  it('shows size buttons with sold-out ones still choosable, and names the chosen one', async () => {
    const w = mount(QRadioGroup, {
      props: { label: 'Size', layout: 'buttons', defaultValue: 'M' },
      slots: { default: () => ['S', 'M', 'XL'].map((s) => h(QRadio, { value: s, label: s, soldOut: s === 'XL' })) },
    });
    expect(w.findAll('.q-tile--button')).toHaveLength(3);
    const xl = w.findAll('.q-tile')[2];
    expect(xl.classes()).toContain('is-soldout');
    expect(xl.get('input').attributes('disabled')).toBeUndefined();
    expect(xl.get('.q-visually-hidden').text()).toBe('XL, sold out');
    expect(w.get('.q-choicegroup__chosen').text()).toBe('M');
    await xl.get('input').setValue(true);
    expect(w.get('.q-choicegroup__chosen').text()).toBe('XL');
  });

  it('shows swatches with a title and the colour', () => {
    const w = mount(QRadioGroup, {
      props: { label: 'Colour', layout: 'swatches' },
      slots: { default: () => [h(QRadio, { value: 'navy', label: 'Navy', swatch: 'navy' }), h(QRadio, { value: 'rust', label: 'Rust', swatch: 'brown', soldOut: true })] },
    });
    const [navy, rust] = w.findAll('.q-tile--swatch');
    expect(navy.attributes('title')).toBe('Navy');
    expect(rust.attributes('title')).toBe('Rust (sold out)');
    expect(navy.get('.q-tile__face').attributes('style')).toContain('--q-swatch: navy');
    expect(w.find('.q-choicegroup__chosen').exists()).toBe(false);
  });

  it('warns in development when it has no label', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mount(QRadioGroup, { slots: { default: options } });
    expect(warn.mock.calls.some(([m]) => String(m).includes('RadioGroup: pass a label'))).toBe(true);
  });

  it('goes back to defaultValue on form reset', async () => {
    const w = mount(QForm, {
      attachTo: document.body,
      slots: { default: () => h(QRadioGroup, { label: 'Delivery', defaultValue: 'std' }, options) },
    });
    await w.findAll('input')[1].setValue(true);
    expect(checked(w)).toEqual([false, true, false]);
    w.get('form').element.reset();
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();
    expect(checked(w)).toEqual([true, false, false]);
    w.unmount();
  });
});
