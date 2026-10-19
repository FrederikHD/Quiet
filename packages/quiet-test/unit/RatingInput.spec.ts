import { mount, type VueWrapper } from '@vue/test-utils';
import { QForm, QRatingInput } from '@frederikhd/quiet';
import { describe, expect, it } from 'vitest';
import { h, nextTick } from 'vue';

const checked = (w: ReturnType<typeof mount>) =>
  w.findAll('input').findIndex((i) => (i.element as HTMLInputElement).checked) + 1;

describe('QRatingInput', () => {
  it('is a labelled radiogroup of five stars', () => {
    const w = mount(QRatingInput, { props: { name: 'stars' } });
    const root = w.get('.q-rinput');
    expect(root.attributes('role')).toBe('radiogroup');
    expect(w.get(`#${root.attributes('aria-labelledby')}`).text()).toBe('Your rating');
    const inputs = w.findAll('input[type="radio"]');
    expect(inputs).toHaveLength(5);
    for (const i of inputs) expect(i.attributes('name')).toBe('stars');
    expect(w.findAll('.q-rinput__star .q-visually-hidden').map((s) => s.text())).toEqual([
      '1 star, Poor',
      '2 stars, Fair',
      '3 stars, Good',
      '4 stars, Very good',
      '5 stars, Excellent',
    ]);
    expect(w.findAll('svg').every((s) => s.attributes('aria-hidden') === 'true')).toBe(true);
  });

  it('follows v-model and emits the chosen star', async () => {
    const w: VueWrapper = mount(QRatingInput, {
      props: { modelValue: 2, 'onUpdate:modelValue': (v?: number) => w.setProps({ modelValue: v }) },
    });
    expect(checked(w)).toBe(2);
    expect(w.findAll('.q-rinput__star.is-on')).toHaveLength(2);
    expect(w.get('.q-rinput__word').text()).toBe('Fair');
    await w.findAll('input')[3].setValue(true);
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual([4]);
    expect(w.findAll('.q-rinput__star.is-on')).toHaveLength(4);
  });

  it('starts from defaultValue', () => {
    expect(checked(mount(QRatingInput, { props: { defaultValue: 3 } }))).toBe(3);
    expect(checked(mount(QRatingInput))).toBe(0);
  });

  it('previews on hover', async () => {
    const w = mount(QRatingInput, { props: { modelValue: 1 } });
    await w.findAll('.q-rinput__star')[4].trigger('mouseenter');
    expect(w.findAll('.q-rinput__star.is-on')).toHaveLength(5);
    expect(w.get('.q-rinput__word').text()).toBe('Excellent');
    await w.get('.q-rinput__row').trigger('mouseleave');
    expect(w.findAll('.q-rinput__star.is-on')).toHaveLength(1);
  });

  it('wires required, error and hint', () => {
    const w = mount(QRatingInput, { props: { required: true, error: 'Choose from 1 to 5 stars', hint: 'Tap a star' } });
    const root = w.get('.q-rinput');
    expect(root.attributes('aria-required')).toBe('true');
    expect(root.attributes('aria-invalid')).toBe('true');
    const inputs = w.findAll('input');
    expect(inputs[0].attributes('required')).toBeDefined();
    expect(inputs[1].attributes('required')).toBeUndefined();
    const ids = `${w.get('.q-field__msg').attributes('id')} ${w.get('.q-field__hint').attributes('id')}`;
    for (const i of inputs) expect(i.attributes('aria-describedby')).toBe(ids);
    expect(w.findAll('.q-rinput__star.is-invalid')).toHaveLength(5);
    expect(w.find('.q-field__req').exists()).toBe(true);
  });

  it('puts its id on the chosen star, or the first', async () => {
    const w = mount(QRatingInput, { props: { id: 'pv-rating' } });
    expect(w.get('#pv-rating').attributes('value')).toBe('1');
    await w.setProps({ modelValue: 4 });
    expect(w.get('#pv-rating').attributes('value')).toBe('4');
  });

  it('disables every star', () => {
    const w = mount(QRatingInput, { props: { disabled: true } });
    for (const i of w.findAll('input')) expect(i.attributes('disabled')).toBeDefined();
  });

  it('takes its label and strings', () => {
    const w = mount(QRatingInput, {
      props: { label: 'Bewertung', strings: { words: ['a', 'b', 'c', 'd', 'e'], stars: (n: number) => `${n} Sterne` } },
    });
    expect(w.get('.q-field__label').text()).toContain('Bewertung');
    expect(w.findAll('.q-visually-hidden')[0].text()).toBe('1 Sterne, a');
  });

  it('goes back to defaultValue on form reset', async () => {
    const w = mount(QForm, { attachTo: document.body, slots: { default: () => h(QRatingInput, { defaultValue: 2 }) } });
    await w.findAll('input')[4].setValue(true);
    expect(checked(w)).toBe(5);
    w.get('form').element.reset();
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();
    expect(checked(w)).toBe(2);
    w.unmount();
  });
});
