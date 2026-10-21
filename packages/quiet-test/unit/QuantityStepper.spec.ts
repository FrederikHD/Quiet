import { flushPromises, mount } from '@vue/test-utils';
import { QField, QQuantityStepper } from '@frederikhd/quiet';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';

const mk = (props: Record<string, unknown> = {}) =>
  mount(QQuantityStepper, { props, attrs: { 'aria-label': 'Quantity' } });

describe('QQuantityStepper', () => {
  it('is one spinbutton between two untabbable buttons', () => {
    const w = mk({ modelValue: 2, min: 1, max: 10 });
    const input = w.get('input');
    expect(input.attributes('role')).toBe('spinbutton');
    expect(input.attributes('aria-valuenow')).toBe('2');
    expect(input.attributes('aria-valuemin')).toBe('1');
    expect(input.attributes('aria-valuemax')).toBe('10');
    expect(input.attributes('inputmode')).toBe('numeric');
    expect((input.element as HTMLInputElement).value).toBe('2');
    const [dec, inc] = w.findAll('button');
    expect(dec.attributes('aria-label')).toBe('Decrease quantity');
    expect(inc.attributes('aria-label')).toBe('Increase quantity');
    expect(dec.attributes('tabindex')).toBe('-1');
    expect(inc.attributes('tabindex')).toBe('-1');
  });

  it('starts at min (default 1) and steps with the buttons', async () => {
    const w = mk();
    expect(w.get('input').attributes('aria-valuenow')).toBe('1');
    expect(w.findAll('button')[0].attributes('disabled')).toBeDefined();
    await w.findAll('button')[1].trigger('click');
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([2]);
    expect(w.get('input').attributes('aria-valuenow')).toBe('2');
  });

  it('greys out + at the max', () => {
    const w = mk({ modelValue: 5, max: 5 });
    expect(w.findAll('button')[1].attributes('disabled')).toBeDefined();
    expect(w.findAll('button')[0].attributes('disabled')).toBeUndefined();
  });

  it('handles arrows, PageUp/PageDown, Home and End', async () => {
    const w = mk({ modelValue: 5, min: 0, max: 30 });
    const input = w.get('input');
    const last = () => w.emitted('update:modelValue')?.at(-1);
    await input.trigger('keydown', { key: 'ArrowUp' });
    expect(last()).toEqual([6]);
    await w.setProps({ modelValue: 6 });
    await input.trigger('keydown', { key: 'ArrowDown' });
    expect(last()).toEqual([5]);
    await w.setProps({ modelValue: 5 });
    await input.trigger('keydown', { key: 'PageUp' });
    expect(last()).toEqual([15]);
    await w.setProps({ modelValue: 15 });
    await input.trigger('keydown', { key: 'PageDown' });
    expect(last()).toEqual([5]);
    await input.trigger('keydown', { key: 'End' });
    expect(last()).toEqual([30]);
    await input.trigger('keydown', { key: 'Home' });
    expect(last()).toEqual([0]);
  });

  it('keeps typing as a draft, drops letters and commits clamped and snapped on Enter or blur', async () => {
    const w = mk({ modelValue: 2, min: 0, max: 10, step: 2 });
    const input = w.get('input');
    await input.setValue('7a');
    expect((input.element as HTMLInputElement).value).toBe('7');
    expect(w.emitted('update:modelValue')).toBeUndefined();
    await input.trigger('keydown', { key: 'Enter' });
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([8]);
    await w.setProps({ modelValue: 8 });
    await input.setValue('99');
    await input.trigger('blur');
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([10]);
    await w.setProps({ modelValue: 10 });
    // An empty field goes back to the value.
    await input.setValue('');
    await input.trigger('blur');
    expect((input.element as HTMLInputElement).value).toBe('10');
  });

  it('does nothing when disabled or read-only', async () => {
    const w = mk({ modelValue: 3, readonly: true });
    await w.get('input').trigger('keydown', { key: 'ArrowUp' });
    expect(w.findAll('button').every((b) => b.attributes('disabled') !== undefined)).toBe(true);
    await w.setProps({ readonly: false, disabled: true });
    await w.get('input').trigger('keydown', { key: 'ArrowUp' });
    expect(w.emitted('update:modelValue')).toBeUndefined();
    expect(w.get('.q-stepper').classes()).toContain('q-input--disabled');
  });

  it('translates the button names and sets large and invalid', () => {
    const w = mk({ strings: { decrease: 'Weniger', increase: 'Mehr' }, size: 'large', invalid: true });
    expect(w.findAll('button').map((b) => b.attributes('aria-label'))).toEqual(['Weniger', 'Mehr']);
    expect(w.get('.q-stepper').classes()).toEqual(expect.arrayContaining(['q-input--large', 'q-input--invalid']));
    expect(w.get('input').attributes('aria-invalid')).toBe('true');
  });

  it('gets the Field wiring', () => {
    const w = mount(QField, {
      props: { id: 'qty', label: 'Quantity', hint: 'Up to 10' },
      slots: { default: () => h(QQuantityStepper) },
    });
    expect(w.get('input').attributes('id')).toBe('qty');
    expect(w.get('input').attributes('aria-describedby')).toBe('qty-hint');
  });

  it('goes back to its first value on a form reset', async () => {
    const w = mount(
      {
        components: { QQuantityStepper },
        template: '<form><QQuantityStepper aria-label="Quantity" name="qty" /></form>',
      },
      { attachTo: document.body },
    );
    await w.findAll('button')[1].trigger('click');
    expect((w.get('input').element as HTMLInputElement).value).toBe('2');
    (w.get('form').element as HTMLFormElement).reset();
    await new Promise((r) => setTimeout(r, 1));
    await flushPromises();
    expect((w.get('input').element as HTMLInputElement).value).toBe('1');
    expect(w.get('input').attributes('name')).toBe('qty');
    w.unmount();
  });
});

describe('QQuantityStepper (audit fixes)', () => {
  it('keeps values on the step grid when max is off it', async () => {
    const w = mk({ modelValue: 3, min: 1, step: 2, max: 10 });
    await w.get('input').trigger('keydown', { key: 'End' });
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual([9]);
    const typed = mk({ modelValue: 3, min: 1, step: 2, max: 10 });
    await typed.get('input').setValue('10');
    await typed.get('input').trigger('blur');
    expect(typed.emitted('update:modelValue')!.at(-1)).toEqual([9]);
    const top = mk({ modelValue: 9, min: 1, step: 2, max: 10 });
    expect(top.findAll('button').at(-1)!.attributes('disabled')).toBeDefined();
  });
});
