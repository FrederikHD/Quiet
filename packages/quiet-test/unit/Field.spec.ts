import { mount } from '@vue/test-utils';
import { QCheckbox, QCheckboxGroup, QField, QFieldGroup, QForm, QInput, QRadio, QRadioGroup, QSelect } from 'quiet';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, ref } from 'vue';

describe('QField', () => {
  it('labels its control and wires hint and error to it', () => {
    const w = mount(QField, {
      props: { id: 'sku', label: 'SKU', hint: 'Letters and numbers', error: 'Enter a SKU', required: true },
      slots: { default: () => h(QInput) },
    });
    const input = w.get('input');
    expect(input.attributes('id')).toBe('sku');
    expect(w.get('label').attributes('for')).toBe('sku');
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-required')).toBe('true');
    expect(input.attributes('aria-describedby')).toBe('sku-msg sku-hint');
    expect(w.get('#sku-msg').text()).toContain('Enter a SKU');
    expect(w.get('.q-field__req').text()).toBe('*');
  });

  it('gives native controls the same wiring through controlAttrs', () => {
    const w = mount(QField, {
      props: { id: 'note', label: 'Note', hint: 'Shown on the invoice' },
      slots: { default: ({ controlAttrs }: { controlAttrs: Record<string, unknown> }) => h('textarea', controlAttrs) },
    });
    expect(w.get('textarea').attributes('id')).toBe('note');
    expect(w.get('textarea').attributes('aria-describedby')).toBe('note-hint');
  });

  it('shows "(optional)" with markers="optional"', () => {
    const w = mount(QField, { props: { label: 'Company', markers: 'optional' }, slots: { default: () => h(QInput) } });
    expect(w.get('.q-field__opt').text()).toBe('(optional)');
  });

  it('takes its label placement from the Form', () => {
    const w = mount(QForm, {
      props: { labelPlacement: 'top' },
      slots: { default: () => h(QField, { label: 'Name' }, () => h(QInput)) },
    });
    expect(w.get('.q-field').classes()).toContain('q-field--top');
  });
});

describe('QFieldGroup', () => {
  it('names the group and passes its message to every field', () => {
    const w = mount(QFieldGroup, {
      props: { id: 'size', label: 'Size', error: 'Enter all three' },
      slots: {
        default: () => [
          h(QField, { id: 'l', label: 'Length' }, () => h(QInput)),
          h(QField, { id: 'w', label: 'Width' }, () => h(QInput)),
        ],
      },
    });
    const root = w.get('.q-fgroup');
    expect(root.attributes('role')).toBe('group');
    expect(root.attributes('aria-labelledby')).toBe('size-label');
    for (const id of ['l', 'w']) {
      const input = w.get(`#${id}`);
      expect(input.attributes('aria-describedby')).toContain('size-msg');
      expect(input.attributes('aria-invalid')).toBe('true');
    }
    // Labels in a group always sit on top.
    expect(w.findAll('.q-fgroup__row > .q-field').every((f) => f.classes().includes('q-field--top'))).toBe(true);
  });
});

describe('QInput', () => {
  it('works with v-model and clears', async () => {
    const value = ref('Linen');
    const Host = defineComponent({
      setup: () => () =>
        h(QInput, { 'aria-label': 'Search', modelValue: value.value, 'onUpdate:modelValue': (v: unknown) => (value.value = v as string), clearable: true }),
    });
    const w = mount(Host, { attachTo: document.body });
    await w.get('input').setValue('Linen shirt');
    expect(value.value).toBe('Linen shirt');
    await w.get('.q-input__clear').trigger('click');
    expect(value.value).toBe('');
    expect(w.find('.q-input__clear').exists()).toBe(false);
    w.unmount();
  });
});

describe('QSelect', () => {
  it('renders options and a placeholder, and updates v-model', async () => {
    const w = mount(QSelect, {
      props: { 'aria-label': 'Country', placeholder: 'Choose a country', options: ['DE', { value: 'AT', label: 'Austria' }] } as never,
    });
    expect(w.get('.q-select').classes()).toContain('q-select--empty');
    const opts = w.findAll('option');
    expect(opts.map((o) => o.text())).toEqual(['Choose a country', 'DE', 'Austria']);
    await w.get('select').setValue('AT');
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['AT']);
  });
});

describe('QCheckboxGroup', () => {
  it('holds the ticked values and gives its id to the first option', async () => {
    const value = ref<string[]>(['email']);
    const Host = defineComponent({
      setup: () => () =>
        h(
          QCheckboxGroup,
          { id: 'notify', label: 'Notify the customer by', modelValue: value.value, 'onUpdate:modelValue': (v: string[]) => (value.value = v) },
          () => [h(QCheckbox, { value: 'email', label: 'Email' }), h(QCheckbox, { value: 'sms', label: 'Text message' })],
        ),
    });
    const w = mount(Host);
    const boxes = w.findAll('input[type="checkbox"]');
    expect((boxes[0].element as HTMLInputElement).checked).toBe(true);
    expect(boxes[0].attributes('id')).toBe('notify');
    await boxes[1].setValue(true);
    expect(value.value).toEqual(['email', 'sms']);
    await boxes[0].setValue(false);
    expect(value.value).toEqual(['sms']);
  });
});

describe('QRadioGroup', () => {
  it('is a radiogroup with one shared name', async () => {
    const w = mount(QRadioGroup, {
      props: { label: 'Delivery', modelValue: 'standard' },
      slots: { default: () => [h(QRadio, { value: 'standard', label: 'Standard' }), h(QRadio, { value: 'express', label: 'Express' })] },
    });
    expect(w.get('[role="radiogroup"]').exists()).toBe(true);
    const radios = w.findAll('input[type="radio"]');
    expect(new Set(radios.map((r) => r.attributes('name'))).size).toBe(1);
    expect((radios[0].element as HTMLInputElement).checked).toBe(true);
    await radios[1].setValue(true);
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['express']);
  });
});
