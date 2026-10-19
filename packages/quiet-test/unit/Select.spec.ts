import { flushPromises, mount } from '@vue/test-utils';
import { QField, QSelect } from '@frederikhd/quiet';
import { describe, expect, it } from 'vitest';
import { h, nextTick } from 'vue';

const sel = (w: { get: (s: string) => { element: Element } }) => w.get('select').element as HTMLSelectElement;

describe('QSelect', () => {
  it('renders options, groups and disabled options', () => {
    const w = mount(QSelect, {
      props: {
        options: [
          'S',
          { value: 'XL', label: 'XL — sold out', disabled: true },
          { label: 'Kids', options: ['104', '110'] },
        ],
      },
      attrs: { 'aria-label': 'Size' },
    });
    expect(w.findAll('option').map((o) => o.text())).toEqual(['S', 'XL — sold out', '104', '110']);
    expect(w.findAll('option')[1].attributes('disabled')).toBeDefined();
    expect(w.get('optgroup').attributes('label')).toBe('Kids');
  });

  it('shows the chosen value and follows v-model', async () => {
    const w = mount(QSelect, {
      props: { options: ['DE', 'AT', 'CH'], modelValue: 'AT' },
      attrs: { 'aria-label': 'Country' },
    });
    await nextTick();
    expect(sel(w).value).toBe('AT');
    await w.setProps({ modelValue: 'CH' });
    await nextTick();
    expect(sel(w).value).toBe('CH');
    await w.get('select').setValue('DE');
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['DE']);
  });

  it('shows its first option when there is no value and no placeholder, like a native select', async () => {
    const w = mount(QSelect, { props: { options: ['Standard', 'Express'] }, attrs: { 'aria-label': 'Shipping' } });
    await nextTick();
    expect(sel(w).value).toBe('Standard');
  });

  it('takes <option> children from the slot', async () => {
    const w = mount(QSelect, {
      props: { modelValue: 'b' },
      attrs: { 'aria-label': 'x' },
      slots: { default: () => [h('option', { value: 'a' }, 'A'), h('option', { value: 'b' }, 'B')] },
    });
    await nextTick();
    expect(sel(w).value).toBe('b');
  });

  it('keeps an optional placeholder choosable and hides a required one', async () => {
    const w = mount(QSelect, { props: { options: ['DE'], placeholder: 'No category' }, attrs: { 'aria-label': 'x' } });
    const ph = w.get('option');
    expect(ph.attributes('value')).toBe('');
    expect(ph.attributes('disabled')).toBeUndefined();
    expect(w.get('.q-select').classes()).toContain('q-select--empty');
    await w.setProps({ required: true });
    expect(w.get('option').attributes('disabled')).toBeDefined();
    expect(w.get('option').attributes('hidden')).toBeDefined();
    await w.setProps({ modelValue: 'DE' });
    expect(w.get('.q-select').classes()).not.toContain('q-select--empty');
  });

  it('is read-only by being disabled, with a hidden input that keeps the value in posts', () => {
    const w = mount(QSelect, {
      props: { options: ['Berlin'], modelValue: 'Berlin', readonly: true, name: 'warehouse' },
      attrs: { 'aria-label': 'x' },
    });
    expect(w.get('.q-select').classes()).toContain('q-input--readonly');
    expect(w.get('.q-select').classes()).not.toContain('q-input--disabled');
    expect(w.get('select').attributes('disabled')).toBeDefined();
    expect(w.get('select').attributes('name')).toBeUndefined();
    const hidden = w.get('input[type="hidden"]');
    expect(hidden.attributes('name')).toBe('warehouse');
    expect(hidden.attributes('value')).toBe('Berlin');
  });

  it('sets size, prefix and invalid', () => {
    const w = mount(QSelect, {
      props: { options: ['a'], size: 'slim', prefixIcon: 'sliders', invalid: true },
      attrs: { 'aria-label': 'Sort' },
    });
    expect(w.get('.q-select').classes()).toEqual(
      expect.arrayContaining(['q-input--slim', 'q-select--prefixed', 'q-input--invalid']),
    );
    expect(w.get('.q-select__prefix').attributes('aria-hidden')).toBe('true');
    expect(w.get('select').attributes('aria-invalid')).toBe('true');
  });

  it('gets the Field wiring, and marks the placeholder required', () => {
    const w = mount(QField, {
      props: { id: 'country', label: 'Country', required: true, error: 'Choose a country' },
      slots: { default: () => h(QSelect, { options: ['DE'], placeholder: 'Choose' }) },
    });
    const s = w.get('select');
    expect(s.attributes('id')).toBe('country');
    expect(s.attributes('aria-required')).toBe('true');
    expect(s.attributes('aria-invalid')).toBe('true');
    expect(s.attributes('aria-describedby')).toBe('country-msg');
    expect(w.get('option').attributes('hidden')).toBeDefined();
  });

  it('goes back to its first value on a form reset', async () => {
    const w = mount(
      {
        components: { QSelect },
        data: () => ({ v: 'AT' }),
        template: '<form><QSelect v-model="v" :options="[\'DE\', \'AT\', \'CH\']" aria-label="Country" /></form>',
      },
      { attachTo: document.body },
    );
    await w.get('select').setValue('CH');
    expect((w.vm as unknown as { v: string }).v).toBe('CH');
    (w.get('form').element as HTMLFormElement).reset();
    await new Promise((r) => setTimeout(r, 1));
    await flushPromises();
    expect((w.vm as unknown as { v: string }).v).toBe('AT');
    expect(sel(w).value).toBe('AT');
    w.unmount();
  });
});
