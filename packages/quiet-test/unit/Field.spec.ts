import { mount } from '@vue/test-utils';
import {
  QCheckbox,
  QCheckboxGroup,
  QField,
  QFieldGroup,
  QForm,
  QInput,
  QQuantityStepper,
  QRadio,
  QRadioGroup,
  QSelect,
  QTextarea,
} from 'quiet';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';

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
        h(QInput, {
          'aria-label': 'Search',
          modelValue: value.value,
          'onUpdate:modelValue': (v: unknown) => (value.value = v as string),
          clearable: true,
        }),
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
      props: {
        'aria-label': 'Country',
        placeholder: 'Choose a country',
        options: ['DE', { value: 'AT', label: 'Austria' }],
      } as never,
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
          {
            id: 'notify',
            label: 'Notify the customer by',
            modelValue: value.value,
            'onUpdate:modelValue': (v: string[]) => (value.value = v),
          },
          () => [
            h(QCheckbox, { value: 'email', label: 'Email' }),
            h(QCheckbox, { value: 'sms', label: 'Text message' }),
          ],
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
      slots: {
        default: () => [
          h(QRadio, { value: 'standard', label: 'Standard' }),
          h(QRadio, { value: 'express', label: 'Express' }),
        ],
      },
    });
    expect(w.get('[role="radiogroup"]').exists()).toBe(true);
    const radios = w.findAll('input[type="radio"]');
    expect(new Set(radios.map((r) => r.attributes('name'))).size).toBe(1);
    expect((radios[0].element as HTMLInputElement).checked).toBe(true);
    await radios[1].setValue(true);
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['express']);
  });
});

describe('QField wiring', () => {
  it('takes the id of the control inside, so the label still points at it', async () => {
    const w = mount(QField, {
      props: { label: 'SKU', hint: 'Letters' },
      slots: { default: () => h(QInput, { id: 'own-sku' }) },
    });
    await nextTick();
    expect(w.get('input').attributes('id')).toBe('own-sku');
    expect(w.get('label').attributes('for')).toBe('own-sku');
    expect(w.get('input').attributes('aria-describedby')).toBe('own-sku-hint');
  });

  it("lets its own id win over the control's", async () => {
    const w = mount(QField, {
      props: { id: 'field-id', label: 'SKU' },
      slots: { default: () => h(QInput, { id: 'own' }) },
    });
    await nextTick();
    expect(w.get('input').attributes('id')).toBe('field-id');
    expect(w.get('label').attributes('for')).toBe('field-id');
  });

  it('generates an id when nobody gives one', () => {
    const w = mount(QField, { props: { label: 'Name' }, slots: { default: () => h(QInput) } });
    const id = w.get('input').attributes('id');
    expect(id).toMatch(/^q-field-/);
    expect(w.get('label').attributes('for')).toBe(id);
    expect(w.get('label').attributes('id')).toBe(`${id}-label`);
  });

  it('shows one message, error first, with a hidden prefix in a polite live region', async () => {
    const w = mount(QField, {
      props: { id: 'p', label: 'Price', error: 'Enter a price', warning: 'Below cost', success: 'Ok' },
      slots: { default: () => h(QInput) },
    });
    expect(w.findAll('.q-field__msg')).toHaveLength(1);
    expect(w.get('.q-field__msg').classes()).toContain('q-field__msg--error');
    expect(w.get('.q-field__msg .q-visually-hidden').text()).toBe('Error:');
    expect(w.get('.q-field__live').attributes('aria-live')).toBe('polite');

    await w.setProps({ error: null });
    expect(w.get('.q-field__msg').classes()).toContain('q-field__msg--warning');
    expect(w.get('.q-field__msg').text()).toContain('Warning:');
    expect(w.get('input').attributes('aria-invalid')).toBeUndefined();

    await w.setProps({ warning: null });
    expect(w.get('.q-field__msg').classes()).toContain('q-field__msg--success');
    // No prefix for success by default.
    expect(w.find('.q-field__msg .q-visually-hidden').exists()).toBe(false);

    await w.setProps({ success: null });
    expect(w.find('.q-field__msg').exists()).toBe(false);
    // The live region stays, so a later message is announced.
    expect(w.find('.q-field__live').exists()).toBe(true);
  });

  it('keeps a space between the hidden prefix and the message', () => {
    const w = mount(QField, {
      props: { id: 'e', label: 'Email', error: 'Enter an email' },
      slots: { default: () => h(QInput) },
    });
    expect(w.get('.q-field__msg .q-visually-hidden').element.textContent).toBe('Error: ');
    expect(w.get('#e-msg').element.textContent).toContain('Error: Enter an email');
  });

  it('passes disabled and readonly to the control and greys the label', () => {
    const w = mount(QField, {
      props: { label: 'Order', disabled: true, readonly: true },
      slots: { default: () => h(QInput) },
    });
    expect(w.get('.q-field').classes()).toContain('q-field--disabled');
    expect(w.get('input').attributes('disabled')).toBeDefined();
    expect(w.get('input').attributes('readonly')).toBeDefined();
  });

  it('names the help button after the label and opens a tip', async () => {
    const w = mount(QField, {
      props: { label: 'SKU', help: 'Stock keeping unit.' },
      slots: { default: () => h(QInput) },
      attachTo: document.body,
    });
    const btn = w.get('.q-field__help button');
    expect(btn.attributes('aria-label')).toBe('Help: SKU');
    await btn.trigger('click');
    await nextTick();
    expect(document.body.textContent).toContain('Stock keeping unit.');
    w.unmount();
  });

  it('names the help button from a label slot too', () => {
    const w = mount(QField, {
      props: { help: 'What it is.' },
      slots: { label: () => 'Weight', default: () => h(QInput) },
    });
    expect(w.get('.q-field__help button').attributes('aria-label')).toBe('Help: Weight');
    expect(w.get('label').text()).toBe('Weight');
  });

  it('hides the label visually, limits the width and sets the label width', () => {
    const w = mount(QField, {
      props: { label: 'Search', labelHidden: true, width: 's', labelWidth: '160px' },
      slots: { default: () => h(QInput) },
    });
    expect(w.get('.q-field__labelcol').classes()).toContain('q-visually-hidden');
    expect(w.get('.q-field__control').classes()).toContain('q-field__control--s');
    expect(w.get('.q-field').attributes('style')).toContain('--q-label-w: 160px');
  });

  it('follows its own label placement, and the markers and strings of the Form', () => {
    const w = mount(QForm, {
      props: { labelPlacement: 'top', markers: 'optional', strings: { optional: 'freiwillig' } },
      slots: {
        default: () => [
          h(QField, { label: 'Company', labelPlacement: 'side' }, () => h(QInput)),
          h(QField, { label: 'Email', required: true }, () => h(QInput)),
        ],
      },
    });
    const [company, email] = w.findAll('.q-field');
    expect(company.classes()).toContain('q-field--side');
    expect(company.get('.q-field__opt').text()).toBe('(freiwillig)');
    expect(email.find('.q-field__opt').exists()).toBe(false);
    expect(email.find('.q-field__req').exists()).toBe(false);
  });

  it('hides the asterisk with markers="none"', () => {
    const w = mount(QField, {
      props: { label: 'Email', required: true, markers: 'none' },
      slots: { default: () => h(QInput) },
    });
    expect(w.find('.q-field__req').exists()).toBe(false);
    expect(w.get('input').attributes('aria-required')).toBe('true');
  });

  it('wires a lone Checkbox, Textarea, Select and QuantityStepper as well', () => {
    for (const control of [QCheckbox, QTextarea, QSelect, QQuantityStepper]) {
      const w = mount(QField, {
        props: { id: 'c', label: 'Control', hint: 'Hint', error: 'Wrong', required: true },
        slots: { default: () => h(control as never) },
      });
      const el = w.get('#c');
      expect(el.attributes('aria-describedby')).toContain('c-msg c-hint');
      expect(el.attributes('aria-invalid')).toBe('true');
      expect(el.attributes('aria-required')).toBe('true');
      w.unmount();
    }
  });
});
