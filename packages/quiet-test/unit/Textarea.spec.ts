import { mount } from '@vue/test-utils';
import { QField, QTextarea } from '@frederikhd/quiet';
import { describe, expect, it } from 'vitest';
import { h, nextTick } from 'vue';

describe('QTextarea', () => {
  it('renders a textarea in the input box with 4 rows by default', () => {
    const w = mount(QTextarea, { attrs: { 'aria-label': 'Note', placeholder: 'Only your team' } });
    expect(w.get('span').classes()).toEqual(expect.arrayContaining(['q-input', 'q-textarea']));
    const ta = w.get('textarea.q-textarea__field');
    expect(ta.attributes('rows')).toBe('4');
    expect(ta.attributes('placeholder')).toBe('Only your team');
  });

  it('works with v-model', async () => {
    const w = mount(QTextarea, { props: { modelValue: 'Hi' }, attrs: { 'aria-label': 'Note' } });
    expect((w.get('textarea').element as HTMLTextAreaElement).value).toBe('Hi');
    await w.get('textarea').setValue('Hello');
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['Hello']);
  });

  it('counts characters, describes the field with the counter, and turns near the limit', async () => {
    const w = mount(QTextarea, {
      props: { modelValue: 'abc', maxlength: 100 },
      attrs: { 'aria-label': 'Gift message' },
    });
    const count = w.get('.q-textarea__count');
    expect(count.text()).toBe('3 / 100');
    expect(count.attributes('aria-live')).toBe('off');
    expect(w.get('textarea').attributes('maxlength')).toBe('100');
    expect(w.get('textarea').attributes('aria-describedby')).toBe(count.attributes('id'));
    await w.setProps({ modelValue: 'x'.repeat(91) });
    expect(count.text()).toBe('9 characters left');
    expect(count.classes()).toContain('is-near');
    expect(count.attributes('aria-live')).toBe('polite');
    await w.setProps({ modelValue: 'x'.repeat(99) });
    expect(count.text()).toBe('1 character left');
  });

  it('counts without v-model too', async () => {
    const w = mount(QTextarea, { props: { maxlength: 20 }, attrs: { 'aria-label': 'x' } });
    await w.get('textarea').setValue('hello');
    expect(w.get('.q-textarea__count').text()).toBe('5 / 20');
  });

  it('hides the counter with showCount=false and translates it', () => {
    const off = mount(QTextarea, { props: { maxlength: 20, showCount: false }, attrs: { 'aria-label': 'x' } });
    expect(off.find('.q-textarea__count').exists()).toBe(false);
    const de = mount(QTextarea, {
      props: { modelValue: 'ab', maxlength: 20, strings: { count: (n: number, m: number) => `${n} von ${m}` } },
      attrs: { 'aria-label': 'x' },
    });
    expect(de.get('.q-textarea__count').text()).toBe('2 von 20');
  });

  it('sets state classes and the auto-grow modifier', () => {
    const w = mount(QTextarea, {
      props: { size: 'large', invalid: true, disabled: true, autoGrow: true },
      attrs: { 'aria-label': 'x' },
    });
    expect(w.get('.q-textarea').classes()).toEqual(
      expect.arrayContaining(['q-input--large', 'q-input--invalid', 'q-input--disabled', 'q-textarea--grow']),
    );
    expect(w.get('textarea').attributes('aria-invalid')).toBe('true');
    expect(w.get('textarea').attributes('disabled')).toBeDefined();
  });

  it('joins the Field and the counter in aria-describedby', () => {
    const w = mount(QField, {
      props: { id: 'desc', label: 'Description', hint: 'Shown on the product page', readonly: true },
      slots: { default: () => h(QTextarea, { maxlength: 500 }) },
    });
    const ta = w.get('textarea');
    expect(ta.attributes('id')).toBe('desc');
    expect(ta.attributes('readonly')).toBeDefined();
    expect(ta.attributes('aria-describedby')).toMatch(/^desc-hint q-textarea-count-/);
  });

  it('follows a form reset', async () => {
    const w = mount(
      { components: { QTextarea }, template: '<form><QTextarea aria-label="Note" :maxlength="50" /></form>' },
      { attachTo: document.body },
    );
    await w.get('textarea').setValue('hello');
    expect(w.get('.q-textarea__count').text()).toBe('5 / 50');
    (w.get('form').element as HTMLFormElement).reset();
    await new Promise((r) => setTimeout(r, 1));
    await nextTick();
    expect(w.get('.q-textarea__count').text()).toBe('0 / 50');
    w.unmount();
  });
});
