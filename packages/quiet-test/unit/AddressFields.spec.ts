import { mount } from '@vue/test-utils';
import { QAddressFields, validateAddress, type Address } from '@frederikhd/quiet';
import { describe, expect, it } from 'vitest';

const labels = (w: ReturnType<typeof mount>) => w.findAll('.q-field__label').map((l) => l.text().replace(/\s*\*$/, '').replace(/\s*\(optional\)$/, ''));
const ids = (w: ReturnType<typeof mount>) => w.findAll('input, select').map((e) => e.attributes('id'));

describe('QAddressFields', () => {
  it('lays out a German address: postcode before the city', () => {
    const w = mount(QAddressFields, { props: { modelValue: { country: 'DE' } } });
    expect(ids(w)).toEqual([
      'address-country', 'address-firstName', 'address-lastName', 'address-company', 'address-line1', 'address-line2',
      'address-postalCode', 'address-city', 'address-phone',
    ]);
    expect(labels(w)).toContain('Postcode');
    expect(w.get('#address-postalCode').attributes('inputmode')).toBe('numeric');
  });

  it('lays out a US address: city, state, ZIP', () => {
    const w = mount(QAddressFields, { props: { modelValue: { country: 'US' }, idPrefix: 'ship' } });
    expect(ids(w).slice(-4)).toEqual(['ship-city', 'ship-state', 'ship-postalCode', 'ship-phone']);
    expect(labels(w)).toContain('ZIP code');
  });

  it('lays out a UK address: town, then a short postcode', () => {
    const w = mount(QAddressFields, { props: { modelValue: { country: 'GB' } } });
    expect(ids(w).slice(-3)).toEqual(['address-city', 'address-postalCode', 'address-phone']);
    expect(labels(w)).toContain('Town or city');
    expect(w.get('#address-postalCode').attributes('inputmode')).toBeUndefined();
  });

  it('sets autocomplete tokens for the kind and section', () => {
    const w = mount(QAddressFields, { props: { modelValue: { country: 'DE' }, kind: 'billing', section: 'gift' } });
    expect(w.get('#address-country').attributes('autocomplete')).toBe('section-gift billing country');
    expect(w.get('#address-firstName').attributes('autocomplete')).toBe('section-gift billing given-name');
    expect(w.get('#address-phone').attributes('autocomplete')).toBe('section-gift billing tel');
    expect(w.get('#address-phone').attributes('type')).toBe('tel');
    const none = mount(QAddressFields, { props: { modelValue: {}, kind: 'none' } });
    expect(none.get('#address-line1').attributes('autocomplete')).toBe('address-line1');
  });

  it('hides and requires optional parts', () => {
    const w = mount(QAddressFields, { props: { modelValue: { country: 'DE' }, fields: { company: 'hidden', line2: 'hidden', phone: 'required' } } });
    expect(w.find('#address-company').exists()).toBe(false);
    expect(w.find('#address-line2').exists()).toBe(false);
    expect(w.get('#address-phone').attributes('aria-required')).toBe('true');
  });

  it('shows the phone hint, or none with null', () => {
    const w = mount(QAddressFields, { props: { modelValue: {} } });
    expect(w.get('#address-phone-hint').text()).toBe('Only used if the courier needs to reach you');
    const none = mount(QAddressFields, { props: { modelValue: {}, phoneHint: null } });
    expect(none.find('#address-phone-hint').exists()).toBe(false);
  });

  it('updates the whole address and says which key changed', async () => {
    const w = mount(QAddressFields, {
      props: { modelValue: { country: 'DE' } as Address, 'onUpdate:modelValue': (v: Address) => w.setProps({ modelValue: v }) },
    });
    await w.get('#address-city').setValue('Berlin');
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual([{ country: 'DE', city: 'Berlin' }]);
    expect(w.emitted('change')!.at(-1)).toEqual([{ country: 'DE', city: 'Berlin' }, 'city']);
    await w.get('#address-country').setValue('US');
    expect(w.emitted('change')!.at(-1)![1]).toBe('country');
    expect(w.find('#address-state').exists()).toBe(true);
  });

  it('shows per-field errors on their fields', () => {
    const w = mount(QAddressFields, { props: { modelValue: { country: 'DE' }, errors: { city: 'Enter your city' } } });
    const city = w.get('#address-city');
    expect(city.attributes('aria-invalid')).toBe('true');
    expect(city.attributes('aria-describedby')).toContain('address-city-msg');
    expect(w.get('#address-city-msg').text()).toContain('Enter your city');
  });

  it('disables every part', () => {
    const w = mount(QAddressFields, { props: { modelValue: {}, disabled: true } });
    for (const el of w.findAll('input, select')) expect(el.attributes('disabled')).toBeDefined();
  });

  it('takes its own strings', () => {
    const w = mount(QAddressFields, { props: { modelValue: { country: 'DE' }, strings: { city: 'Ort' } } });
    expect(labels(w)).toContain('Ort');
  });
});

describe('validateAddress', () => {
  it('lists missing parts, a bad postcode, a missing house number and a bad phone', () => {
    const r = validateAddress({ country: 'DE', firstName: 'Ada', lastName: 'L', line1: 'Torstraße', postalCode: '123', city: 'Berlin', phone: 'abc' }, { idPrefix: 'ship' });
    expect(r.valid).toBe(false);
    expect(r.errors).toEqual({
      line1: 'Add the house number',
      postalCode: 'Enter a valid postcode, like 10115',
      phone: 'Enter a phone number with digits only, + and spaces',
    });
    expect(r.list[0]).toEqual({ id: 'ship-line1', message: 'Add the house number' });
  });

  it('asks for a country first', () => {
    expect(validateAddress({}).errors.country).toBe('Choose a country');
  });

  it('passes a complete address', () => {
    const r = validateAddress({ country: 'US', firstName: 'A', lastName: 'B', line1: '1 Main St', city: 'NYC', state: 'NY', postalCode: '10001' });
    expect(r).toEqual({ errors: {}, list: [], valid: true });
  });
});
