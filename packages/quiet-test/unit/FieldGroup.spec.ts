import { flushPromises, mount } from '@vue/test-utils';
import { QField, QFieldGroup, QForm, QInput, QSelect } from '@frederikhd/quiet';
import { describe, expect, it } from 'vitest';
import { h, nextTick } from 'vue';

const two = () => [
  h(QField, { id: 'a', label: 'First' }, () => h(QInput)),
  h(QField, { id: 'b', label: 'Second' }, () => h(QInput)),
];

function setWidth(el: Element, width: number) {
  Object.defineProperty(el, 'clientWidth', { configurable: true, value: width });
}

describe('QFieldGroup', () => {
  it('has no group role without a label, and keeps the id on the root', () => {
    const w = mount(QFieldGroup, { props: { id: 'addr' }, slots: { default: two } });
    const root = w.get('.q-fgroup');
    expect(root.attributes('id')).toBe('addr');
    expect(root.attributes('role')).toBeUndefined();
    expect(root.classes()).toContain('q-fgroup--unlabelled');
  });

  it('builds equal or weighted columns', async () => {
    const w = mount(QFieldGroup, { props: { label: 'Address' }, slots: { default: two } });
    expect(w.get('.q-fgroup__row').attributes('style')).toContain(
      'grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)',
    );
    await w.setProps({ columns: [3, 1] });
    expect(w.get('.q-fgroup__row').attributes('style')).toContain('minmax(0, 3fr) minmax(0, 1fr)');
    await w.setProps({ columns: ['8rem', 1] });
    expect(w.get('.q-fgroup__row').attributes('style')).toContain('8rem minmax(0, 1fr)');
  });

  it('gives connected parts a 72px floor and adds the modifier classes', async () => {
    const w = mount(QFieldGroup, {
      props: { label: 'Phone', connected: true, stack: 'late', columns: [1, 3] },
      slots: { default: two },
    });
    await nextTick();
    expect(w.get('.q-fgroup__row').attributes('style')).toContain('minmax(72px, 1fr) minmax(72px, 3fr)');
    expect(w.get('.q-fgroup').classes()).toEqual(expect.arrayContaining(['q-fgroup--connected', 'q-fgroup--late']));
  });

  it('stacks when the narrowest column gets too small', async () => {
    const w = mount(QFieldGroup, {
      props: { label: 'Address', columns: [3, 1] },
      slots: { default: two },
      attachTo: document.body,
    });
    const controls = w.get('.q-fgroup__controls').element;
    setWidth(controls, 800); // 800 × 1/4 = 200px: room enough
    await w.setProps({ columns: [3, 1.01] });
    await flushPromises();
    expect(w.get('.q-fgroup').classes()).not.toContain('q-fgroup--stacked');
    setWidth(controls, 300); // 300 × 1/4 = 75px < 100px
    await w.setProps({ columns: [3, 1] });
    await flushPromises();
    expect(w.get('.q-fgroup').classes()).toContain('q-fgroup--stacked');
    // stack="late" holds on down to 88px per field.
    setWidth(controls, 190); // 95px per field
    await w.setProps({ columns: [1, 1], stack: 'late' });
    await flushPromises();
    expect(w.get('.q-fgroup').classes()).not.toContain('q-fgroup--stacked');
    await w.setProps({ stack: 'auto' });
    await flushPromises();
    expect(w.get('.q-fgroup').classes()).toContain('q-fgroup--stacked');
    w.unmount();
  });

  it('wires its hint and message into every field, disables them all, and keeps their own messages first', () => {
    const w = mount(QFieldGroup, {
      props: { id: 'g', label: 'Sale period', hint: 'Both dates', warning: 'Short sale', disabled: true },
      slots: {
        default: () => [
          h(QField, { id: 'from', label: 'Starts', error: 'Pick a date' }, () => h(QInput)),
          h(QField, { id: 'to', label: 'Ends' }, () => h(QSelect, { options: ['a'] })),
        ],
      },
    });
    expect(w.get('#from').attributes('aria-describedby')).toBe('from-msg g-msg g-hint');
    expect(w.get('#to').attributes('aria-describedby')).toBe('g-msg g-hint');
    // A warning on the group doesn't make the fields invalid; the field's own error does.
    expect(w.get('#from').attributes('aria-invalid')).toBe('true');
    expect(w.get('#to').attributes('aria-invalid')).toBeUndefined();
    expect(w.get('#from').attributes('disabled')).toBeDefined();
    expect(w.get('#to').attributes('disabled')).toBeDefined();
    expect(w.get('.q-fgroup').classes()).toContain('q-field--disabled');
  });

  it('shows markers, help and a hidden label', () => {
    const w = mount(QFieldGroup, {
      props: { label: 'Dimensions', required: true, help: 'Packed size.', labelHidden: true },
      slots: { default: two },
    });
    expect(w.get('.q-fgroup > .q-field__layout > .q-field__labelcol').classes()).toContain('q-visually-hidden');
    expect(w.get('.q-fgroup .q-field__req').text()).toBe('*');
    expect(w.get('.q-field__help button').attributes('aria-label')).toBe('Help: Dimensions');
  });

  it('takes a label slot', () => {
    const w = mount(QFieldGroup, { slots: { label: () => 'Phone', default: two } });
    const root = w.get('.q-fgroup');
    expect(root.attributes('role')).toBe('group');
    expect(w.get(`#${root.attributes('aria-labelledby')}`).text()).toBe('Phone');
  });

  it('follows the Form placement for its own label', () => {
    const w = mount(QForm, {
      props: { labelPlacement: 'side' },
      slots: { default: () => h(QFieldGroup, { label: 'Size' }, two) },
    });
    expect(w.get('.q-fgroup').classes()).toContain('q-field--side');
    expect(w.findAll('.q-fgroup__row > .q-field').every((f) => f.classes().includes('q-field--top'))).toBe(true);
  });
});
