import { readFileSync } from 'node:fs';
import { URL as NodeURL } from 'node:url';
import { mount } from '@vue/test-utils';
import { QDiscountCode } from '@frederikhd/quiet';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

const flush = () => new Promise((r) => setTimeout(r, 0));

describe('QDiscountCode', () => {
  it('is a labelled field with Apply', () => {
    const w = mount(QDiscountCode, { props: { apply: () => undefined, id: 'dc' } });
    expect(w.get('label').attributes('for')).toBe('dc');
    expect(w.get('label').text()).toBe('Discount code');
    const input = w.get('#dc');
    expect(input.attributes('autocomplete')).toBe('off');
    expect(input.attributes('autocapitalize')).toBe('characters');
    expect(w.get('.q-btn').text()).toBe('Apply');
  });

  it('applies a code on Enter without submitting, then clears and announces it', async () => {
    const apply = vi.fn(() => undefined);
    const w = mount(QDiscountCode, { props: { apply } });
    const input = w.get('input');
    await input.setValue(' linen10 ');
    const e = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
    input.element.dispatchEvent(e);
    await nextTick();
    expect(e.defaultPrevented).toBe(true);
    expect(apply).toHaveBeenCalledWith('linen10');
    expect((input.element as HTMLInputElement).value).toBe('');
    expect(w.get('[aria-live="polite"].q-visually-hidden').text()).toBe('Discount linen10 applied');
  });

  it('asks for a code when empty', async () => {
    const apply = vi.fn();
    const w = mount(QDiscountCode, { props: { apply } });
    await w.get('.q-btn').trigger('click');
    expect(apply).not.toHaveBeenCalled();
    expect(w.get('.q-field__msg--error').text()).toContain('Enter a discount code');
    expect(w.get('input').attributes('aria-invalid')).toBe('true');
    expect(w.get('input').attributes('aria-describedby')).toBe(w.get('.q-field__msg').attributes('id'));
  });

  it('shows the message from a rejected code, busy meanwhile, and focuses the field', async () => {
    let resolve!: (m: string) => void;
    const w = mount(QDiscountCode, { attachTo: document.body, props: { apply: () => new Promise<string>((r) => (resolve = r)) } });
    await w.get('input').setValue('NOPE');
    await w.get('.q-btn').trigger('click');
    expect(w.get('.q-btn').attributes('aria-busy')).toBe('true');
    resolve('“NOPE” isn’t a valid code');
    await flush();
    expect(w.get('.q-btn').attributes('aria-busy')).toBeUndefined();
    expect(w.get('.q-field__msg--error').text()).toContain('“NOPE” isn’t a valid code');
    expect(document.activeElement).toBe(w.get('input').element);
    // Typing clears the message.
    await w.get('input').setValue('NOPE2');
    expect(w.find('.q-field__msg--error').exists()).toBe(false);
    w.unmount();
  });

  it('turns a thrown error into the message', async () => {
    const w = mount(QDiscountCode, { props: { apply: () => Promise.reject(new Error('Network down')) } });
    await w.get('input').setValue('X');
    await w.get('.q-btn').trigger('click');
    await flush();
    expect(w.get('.q-field__msg--error').text()).toContain('Network down');
  });

  it('quietly ignores a code that is already applied', async () => {
    const apply = vi.fn();
    const w = mount(QDiscountCode, { props: { apply, applied: [{ code: 'LINEN10' }] } });
    await w.get('input').setValue('linen10');
    await w.get('.q-btn').trigger('click');
    expect(apply).not.toHaveBeenCalled();
    expect((w.get('input').element as HTMLInputElement).value).toBe('');
  });

  it('shows applied codes as tags whose names hold their visible text', async () => {
    const w = mount(QDiscountCode, {
      attachTo: document.body,
      props: { apply: () => undefined, applied: [{ code: 'LINEN10', label: '−10 %' }, { code: 'FREESHIP' }] },
    });
    const tags = w.findAll('.q-discount__tags .q-tag');
    expect(tags).toHaveLength(2);
    const [first, second] = tags;
    // WCAG 2.5.3: the visible "LINEN10 −10 %" is part of the name.
    const visible = first.text().replace(/\s+/g, ' ').trim();
    expect(visible).toBe('LINEN10 −10 %');
    expect(first.attributes('aria-label')).toBe('Remove discount LINEN10 −10 %');
    expect(first.attributes('aria-label')).toContain(visible);
    expect(second.attributes('aria-label')).toBe('Remove discount FREESHIP');
    await first.trigger('click');
    expect(w.emitted('remove')).toEqual([['LINEN10']]);
    await nextTick();
    expect(w.get('[aria-live="polite"].q-visually-hidden').text()).toBe('Discount LINEN10 removed');
    expect(document.activeElement).toBe(w.get('input').element);
    w.unmount();
  });

  it('starts as a reveal button when collapsible, and opens to a focused field', async () => {
    const w = mount(QDiscountCode, { attachTo: document.body, props: { apply: () => undefined, collapsible: true } });
    expect(w.find('input').exists()).toBe(false);
    const reveal = w.get('.q-discount__reveal');
    expect(reveal.text()).toBe('Add a discount code');
    expect(reveal.attributes('aria-expanded')).toBe('false');
    await reveal.trigger('click');
    await nextTick();
    expect(document.activeElement).toBe(w.get('input').element);
    w.unmount();
  });

  it('stays open while codes are applied, even when collapsible', () => {
    const w = mount(QDiscountCode, { props: { apply: () => undefined, collapsible: true, applied: [{ code: 'A' }] } });
    expect(w.find('input').exists()).toBe(true);
  });

  it('disables the field, Apply and the tags', () => {
    const w = mount(QDiscountCode, { props: { apply: () => undefined, disabled: true, applied: [{ code: 'A' }] } });
    expect(w.get('input').attributes('disabled')).toBeDefined();
    for (const b of w.findAll('button')) expect(b.attributes('disabled')).toBeDefined();
  });

  it('takes its own label and strings', () => {
    const w = mount(QDiscountCode, { props: { apply: () => undefined, label: 'Gutschein', strings: { apply: 'Einlösen' } } });
    expect(w.get('label').text()).toBe('Gutschein');
    expect(w.get('.q-btn').text()).toBe('Einlösen');
  });

  it('never hides its message live region with display:none, so a later message is announced', () => {
    const css = readFileSync(new NodeURL('../../quiet/src/components/DiscountCode/style.css', import.meta.url), 'utf8');
    const rules = css.split('}').filter((r) => r.includes('.q-field__live'));
    expect(rules.length).toBeGreaterThan(0);
    for (const r of rules) expect(r).not.toMatch(/display:\s*none/);
  });
});
