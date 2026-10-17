import { mount } from '@vue/test-utils';
import { QCheckbox, QCheckboxGroup, QField } from 'quiet';
import { describe, expect, it } from 'vitest';
import { h, nextTick } from 'vue';

describe('QCheckbox', () => {
  it('is a native checkbox inside its label row', () => {
    const w = mount(QCheckbox, { props: { label: 'Track inventory', description: 'Count stock', meta: '3,50 €' } });
    const label = w.get('label.q-choice.q-choice--checkbox');
    expect(label.get('input').attributes('type')).toBe('checkbox');
    expect(label.get('input').classes()).toContain('q-choice__input');
    expect(w.get('.q-choice__label').text()).toBe('Track inventory');
    expect(w.get('.q-choice__desc').text()).toBe('Count stock');
    expect(w.get('.q-choice__meta').text()).toBe('3,50 €');
    expect(w.get('.q-choice__mark').attributes('aria-hidden')).toBe('true');
  });

  it('works with v-model', async () => {
    const w = mount(QCheckbox, { props: { label: 'Newsletter', modelValue: false } });
    await w.get('input').setValue(true);
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([true]);
    await w.setProps({ modelValue: true });
    expect((w.get('input').element as HTMLInputElement).checked).toBe(true);
  });

  it('keeps its own state without v-model', async () => {
    const w = mount(QCheckbox, { props: { label: 'x' } });
    await w.get('input').setValue(true);
    await nextTick();
    expect((w.get('input').element as HTMLInputElement).checked).toBe(true);
  });

  it('shows the indeterminate state as a DOM property, and keeps it while the owner does', async () => {
    const w = mount(QCheckbox, {
      props: { label: 'All stores', indeterminate: true, modelValue: false, 'onUpdate:modelValue': () => {} },
      attachTo: document.body,
    });
    const el = w.get('input').element as HTMLInputElement;
    expect(el.indeterminate).toBe(true);
    // The owner ignores the click: the dash and the empty box stay.
    el.click();
    await nextTick();
    expect(el.indeterminate).toBe(true);
    expect(el.checked).toBe(false);
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([true]);
    await w.setProps({ indeterminate: false });
    expect(el.indeterminate).toBe(false);
    w.unmount();
  });

  it('marks invalid, disabled, card and hidden-label states', () => {
    const w = mount(QCheckbox, {
      props: { label: 'Select order #10421', invalid: true, disabled: true, card: true, labelHidden: true },
    });
    expect(w.get('label').classes()).toEqual(
      expect.arrayContaining(['is-invalid', 'is-disabled', 'q-choice--card', 'q-choice--label-hidden']),
    );
    expect(w.get('.q-choice__text').classes()).toContain('q-visually-hidden');
    expect(w.get('input').attributes('aria-invalid')).toBe('true');
    expect(w.get('input').attributes('disabled')).toBeDefined();
  });

  it('passes native attributes to the input, the class to the row', () => {
    const w = mount(QCheckbox, {
      props: { label: 'x', name: 'terms', id: 'terms', value: 'yes' },
      attrs: { class: 'mine', 'data-x': '1' },
    });
    const input = w.get('input');
    expect(input.attributes()).toMatchObject({ name: 'terms', id: 'terms', value: 'yes', 'data-x': '1' });
    expect(w.get('label').classes()).toContain('mine');
  });

  it('takes rich label and description slots', () => {
    const w = mount(QCheckbox, { slots: { label: () => h('strong', 'Terms'), description: () => 'Read them first' } });
    expect(w.get('.q-choice__label strong').text()).toBe('Terms');
    expect(w.get('.q-choice__desc').text()).toBe('Read them first');
  });

  it('takes the group name, value list, error and first id inside a CheckboxGroup', async () => {
    const w = mount(QCheckboxGroup, {
      props: { id: 'notify', label: 'Notify by', modelValue: ['email'], error: 'Pick one', name: 'notify' },
      slots: {
        default: () => [h(QCheckbox, { value: 'email', label: 'Email' }), h(QCheckbox, { value: 'sms', label: 'SMS' })],
      },
    });
    const [email, sms] = w.findAll('input');
    expect(email.attributes('id')).toBe('notify');
    expect(sms.attributes('name')).toBe('notify');
    expect((email.element as HTMLInputElement).checked).toBe(true);
    expect(sms.attributes('aria-invalid')).toBe('true');
    expect(w.get(`[id="${sms.attributes('aria-describedby')!.split(' ')[0]}"]`).text()).toContain('Pick one');
    await sms.setValue(true);
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['email', 'sms']]);
  });

  it('becomes a tile in the swatches layout', () => {
    const w = mount(QCheckboxGroup, {
      props: { label: 'Colour', layout: 'swatches' },
      slots: { default: () => h(QCheckbox, { value: 'navy', label: 'Navy', swatch: '#123', soldOut: true }) },
    });
    expect(w.get('label.q-tile').classes()).toEqual(expect.arrayContaining(['q-tile--swatch', 'is-soldout']));
    expect(w.get('input').classes()).toContain('q-tile__input');
    expect(w.get('.q-tile .q-visually-hidden').text()).toBe('Navy, sold out');
  });

  it('gets the wiring of a Field it sits in', () => {
    const w = mount(QField, {
      props: { id: 'gift', label: 'Gift', hint: 'Wrapped', error: 'Required', required: true },
      slots: { default: () => h(QCheckbox, { label: 'Wrap it' }) },
    });
    const input = w.get('input');
    expect(input.attributes('id')).toBe('gift');
    expect(input.attributes('aria-describedby')).toBe('gift-msg gift-hint');
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-required')).toBe('true');
  });
});
