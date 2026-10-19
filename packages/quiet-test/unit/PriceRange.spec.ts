import { mount } from '@vue/test-utils';
import { QPriceRange } from 'quiet';
import { describe, expect, it } from 'vitest';

type Range = [number, number];
const mountRange = (props: Record<string, unknown> = {}) => {
  const w = mount(QPriceRange, {
    props: { min: 15, max: 115, step: 5, modelValue: [30, 90] as Range, 'onUpdate:modelValue': (v: Range) => w.setProps({ modelValue: v }), ...props },
  });
  return w;
};

describe('QPriceRange', () => {
  it('is a labelled group with two sliders and two fields', () => {
    const w = mountRange({ currency: 'EUR' });
    const root = w.get('.q-range');
    expect(root.attributes('role')).toBe('group');
    expect(w.get(`#${root.attributes('aria-labelledby')}`).text()).toBe('Price');
    const [lo, hi] = w.findAll('input[type="range"]');
    expect(lo.attributes('aria-label')).toBe('Minimum price');
    expect(hi.attributes('aria-label')).toBe('Maximum price');
    expect(lo.attributes('min')).toBe('15');
    expect(lo.attributes('max')).toBe('115');
    expect(lo.attributes('step')).toBe('5');
    expect((lo.element as HTMLInputElement).value).toBe('30');
    expect((hi.element as HTMLInputElement).value).toBe('90');
    expect(lo.attributes('aria-valuetext')).toMatch(/30/);
    const fields = w.findAll('.q-range__fields input');
    expect(fields.map((f) => (f.element as HTMLInputElement).value)).toEqual(['30', '90']);
    expect(fields[0].attributes('inputmode')).toBe('decimal');
    expect(w.findAll('.q-range__fields .q-field__label').map((l) => l.text())).toEqual(['From', 'To']);
  });

  it('places the fill between the handles', () => {
    const style = mountRange().get('.q-range__track').attributes('style');
    expect(style).toContain('--q-lo: 15%');
    expect(style).toContain('--q-hi: 75%');
  });

  it('moves a handle live and commits when it is let go', async () => {
    const w = mountRange();
    const lo = w.findAll('input[type="range"]')[0];
    await lo.setValue('50');
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual([[50, 90]]);
    expect(w.emitted('commit')).toBeUndefined();
    await lo.trigger('keyup');
    expect(w.emitted('commit')!.at(-1)).toEqual([[50, 90]]);
    await lo.setValue('55');
    await lo.trigger('pointerup');
    expect(w.emitted('commit')).toHaveLength(2);
    expect(w.emitted('commit')!.at(-1)).toEqual([[55, 90]]);
  });

  it("doesn't commit when a handle is focused or clicked without moving", async () => {
    const w = mountRange();
    const [lo, hi] = w.findAll('input[type="range"]');
    await hi.trigger('keyup', { key: 'Tab' });
    await lo.trigger('pointerup');
    expect(w.emitted('commit')).toBeUndefined();
    await lo.setValue('50');
    await lo.trigger('keyup', { key: 'ArrowRight' });
    await lo.trigger('keyup', { key: 'ArrowRight' });
    expect(w.emitted('commit')).toHaveLength(1);
  });

  it('keeps the handles from crossing', async () => {
    const w = mountRange();
    await w.findAll('input[type="range"]')[0].setValue('100');
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual([[90, 90]]);
  });

  it('commits a typed price on blur or Enter, snapped and clamped', async () => {
    const w = mountRange();
    const [from, to] = w.findAll('.q-range__fields input');
    await from.setValue('42,4 €');
    expect((from.element as HTMLInputElement).value).toBe('42,4');
    expect(w.emitted('commit')).toBeUndefined();
    await from.trigger('blur');
    expect(w.emitted('commit')!.at(-1)).toEqual([[40, 90]]);
    await to.setValue('500');
    await to.trigger('keydown', { key: 'Enter' });
    expect(w.emitted('commit')!.at(-1)).toEqual([[40, 115]]);
    expect((to.element as HTMLInputElement).value).toBe('115');
  });

  it('ignores a field left empty', async () => {
    const w = mountRange();
    const from = w.findAll('.q-range__fields input')[0];
    await from.setValue('');
    await from.trigger('blur');
    expect(w.emitted('commit')).toBeUndefined();
    expect((from.element as HTMLInputElement).value).toBe('30');
  });

  it('can hide its label and still name the group', () => {
    const w = mountRange({ labelHidden: true, label: 'Preis' });
    expect(w.get('.q-range').attributes('aria-label')).toBe('Preis');
    expect(w.find('.q-range > .q-field__label').exists()).toBe(false);
  });

  it('disables sliders and fields', () => {
    const w = mountRange({ disabled: true });
    for (const i of w.findAll('input')) expect(i.attributes('disabled')).toBeDefined();
  });
});
