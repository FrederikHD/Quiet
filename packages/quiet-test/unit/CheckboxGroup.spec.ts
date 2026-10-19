import { mount, type VueWrapper } from '@vue/test-utils';
import { QCheckbox, QCheckboxGroup, QForm } from '@frederikhd/quiet';
import { describe, expect, it } from 'vitest';
import { h, nextTick } from 'vue';

const options = () => [
  h(QCheckbox, { value: 'web', label: 'Online store' }),
  h(QCheckbox, { value: 'pos', label: 'Point of sale' }),
  h(QCheckbox, { value: 'market', label: 'Marketplaces', disabled: true }),
];

describe('QCheckboxGroup', () => {
  it('is a labelled group of checkboxes sharing one name', () => {
    const w = mount(QCheckboxGroup, { props: { label: 'Sell on', name: 'channels' }, slots: { default: options } });
    const root = w.get('.q-choicegroup');
    expect(root.attributes('role')).toBe('group');
    const labelId = root.attributes('aria-labelledby')!;
    expect(w.get(`#${labelId}`).text()).toBe('Sell on');
    const inputs = w.findAll('input[type="checkbox"]');
    expect(inputs).toHaveLength(3);
    for (const i of inputs) expect(i.attributes('name')).toBe('channels');
    expect(root.classes()).toEqual(expect.arrayContaining(['q-field', 'q-fgroup', 'q-choicegroup--list']));
  });

  it('generates a name when none is given', () => {
    const w = mount(QCheckboxGroup, { props: { label: 'Sell on' }, slots: { default: options } });
    const names = w.findAll('input').map((i) => i.attributes('name'));
    expect(names[0]).toBeTruthy();
    expect(new Set(names).size).toBe(1);
  });

  it('uses aria-label when there is no visible label', () => {
    const w = mount(QCheckboxGroup, { props: { ariaLabel: 'Columns' }, slots: { default: options } });
    const root = w.get('.q-choicegroup');
    expect(root.attributes('aria-label')).toBe('Columns');
    expect(root.attributes('aria-labelledby')).toBeUndefined();
    expect(root.classes()).toContain('q-fgroup--unlabelled');
  });

  it('ticks from v-model and emits the new array', async () => {
    const w: VueWrapper = mount(QCheckboxGroup, {
      props: { label: 'Sell on', modelValue: ['pos'], 'onUpdate:modelValue': (v?: string[]) => w.setProps({ modelValue: v }) },
      slots: { default: options },
    });
    const [web, pos] = w.findAll('input');
    expect((web.element as HTMLInputElement).checked).toBe(false);
    expect((pos.element as HTMLInputElement).checked).toBe(true);
    await web.setValue(true);
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual([['pos', 'web']]);
    await pos.setValue(false);
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual([['web']]);
  });

  it('starts from defaultValue', () => {
    const w = mount(QCheckboxGroup, { props: { label: 'Sell on', defaultValue: ['web'] }, slots: { default: options } });
    expect((w.find('input[value="web"]').element as HTMLInputElement).checked).toBe(true);
  });

  it('puts the group id on the first enabled option, for the error summary', () => {
    const w = mount(QCheckboxGroup, {
      props: { label: 'Sell on', id: 'channels' },
      slots: { default: () => [h(QCheckbox, { value: 'a', label: 'A', disabled: true }), h(QCheckbox, { value: 'b', label: 'B' })] },
    });
    expect(w.get('#channels').attributes('value')).toBe('b');
  });

  it('wires error and hint to every option and marks them invalid', () => {
    const w = mount(QCheckboxGroup, {
      props: { label: 'Reasons', error: 'Choose at least one reason', hint: 'Pick all that apply', required: true },
      slots: { default: options },
    });
    const msg = w.get('.q-field__msg--error');
    const hint = w.get('.q-field__hint');
    for (const i of w.findAll('input')) {
      expect(i.attributes('aria-describedby')).toBe(`${msg.attributes('id')} ${hint.attributes('id')}`);
      expect(i.attributes('aria-invalid')).toBe('true');
    }
    expect(msg.text()).toContain('Choose at least one reason');
    expect(w.findAll('.q-choice.is-invalid')).toHaveLength(3);
    // The group itself is no radiogroup: aria-required / aria-invalid aren't allowed on role=group.
    expect(w.get('.q-choicegroup').attributes('aria-invalid')).toBeUndefined();
  });

  it('marks a single checkbox required when the group is required', () => {
    const w = mount(QCheckboxGroup, {
      props: { required: true, ariaLabel: 'Terms' },
      slots: { default: () => h(QCheckbox, { value: 'yes', label: 'I accept the terms' }) },
    });
    expect(w.get('input').attributes('aria-required')).toBe('true');
  });

  it('disables every option', () => {
    const w = mount(QCheckboxGroup, { props: { label: 'Channels', disabled: true }, slots: { default: options } });
    expect(w.get('.q-choicegroup').classes()).toContain('q-field--disabled');
    for (const i of w.findAll('input')) expect(i.attributes('disabled')).toBeDefined();
  });

  it('lays out cards in columns', () => {
    const w = mount(QCheckboxGroup, { props: { label: 'Sell on', layout: 'cards', columns: 2 }, slots: { default: options } });
    const opts = w.get('.q-choicegroup__options');
    expect(opts.classes()).toContain('q-choicegroup__options--cards');
    expect(opts.attributes('style')).toContain('--q-cols: 2');
    expect(w.findAll('.q-choice--card')).toHaveLength(3);
  });

  it('shows swatches as tiles and names the chosen ones beside the label', () => {
    const w = mount(QCheckboxGroup, {
      props: { label: 'Colour', layout: 'swatches', defaultValue: ['navy', 'sand'] },
      slots: {
        default: () => [
          h(QCheckbox, { value: 'navy', label: 'Navy', swatch: 'navy' }),
          h(QCheckbox, { value: 'sand', label: 'Sand', swatch: 'tan' }),
          h(QCheckbox, { value: 'rust', label: 'Rust', swatch: 'brown' }),
        ],
      },
    });
    expect(w.findAll('.q-tile--swatch')).toHaveLength(3);
    expect(w.findAll('input.q-tile__input')).toHaveLength(3);
    const chosen = w.get('.q-choicegroup__chosen');
    expect(chosen.text()).toBe('Navy, Sand');
    expect(chosen.attributes('aria-hidden')).toBe('true');
  });

  it('falls back to list for an unknown layout', () => {
    const w = mount(QCheckboxGroup, { props: { label: 'X', layout: 'grid' as never }, slots: { default: options } });
    expect(w.get('.q-choicegroup').classes()).toContain('q-choicegroup--list');
  });

  it('goes back to defaultValue on form reset', async () => {
    const w = mount(QForm, {
      attachTo: document.body,
      slots: { default: () => h(QCheckboxGroup, { label: 'Sell on', defaultValue: ['web'] }, options) },
    });
    const pos = w.get('input[value="pos"]');
    await pos.setValue(true);
    expect((pos.element as HTMLInputElement).checked).toBe(true);
    w.get('form').element.reset();
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();
    expect((pos.element as HTMLInputElement).checked).toBe(false);
    expect((w.get('input[value="web"]').element as HTMLInputElement).checked).toBe(true);
    w.unmount();
  });

  it('takes label placement from the Form', () => {
    const w = mount(QForm, {
      props: { labelPlacement: 'side' },
      slots: { default: () => h(QCheckboxGroup, { label: 'Sell on' }, options) },
    });
    expect(w.get('.q-choicegroup').classes()).toContain('q-field--side');
  });
});
