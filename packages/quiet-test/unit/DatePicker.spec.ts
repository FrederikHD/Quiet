import { mount, type VueWrapper } from '@vue/test-utils';
import { QDatePicker, QField, configure } from '@frederikhd/quiet';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { h, nextTick } from 'vue';

beforeAll(() => configure({ locale: 'de-DE' }));
afterAll(() => configure({ locale: 'en' }));

let w: VueWrapper | null = null;
afterEach(() => {
  w?.unmount();
  w = null;
  document.body.innerHTML = '';
});

function picker(props: Record<string, unknown> = {}) {
  w = mount(QDatePicker, {
    props: { 'aria-label': 'Date', ...props },
    attachTo: document.body,
  });
  return w;
}
const field = () => w!.get('input.q-input__field');
const days = () => Array.from(document.querySelectorAll<HTMLButtonElement>('.q-datepicker__day'));
const day = (n: number) => days().find((d) => d.textContent?.trim() === String(n))!;
async function type(text: string) {
  await field().setValue(text);
  await field().trigger('blur');
}
async function openCalendar() {
  await w!.get('.q-datepicker__button').trigger('click');
  await nextTick();
  await nextTick();
}
const key = async (k: string, init: KeyboardEventInit = {}) => {
  document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, ...init }));
  await nextTick();
  await nextTick();
};
const focused = () => document.activeElement?.getAttribute('aria-label');

describe('QDatePicker', () => {
  it('shows the ISO value in the locale’s format, with the format as placeholder', () => {
    picker({ modelValue: '2026-10-24' });
    expect((field().element as HTMLInputElement).value).toBe('24.10.2026');
    expect(field().attributes('placeholder')).toBe('DD.MM.YYYY');
    expect(field().attributes('inputmode')).toBe('numeric');
  });

  it('reads typed dates in the locale’s order and ISO', async () => {
    picker({ modelValue: null });
    for (const [text, iso] of [
      ['3.1.2027', '2027-01-03'],
      ['24/10/26', '2026-10-24'],
      ['24102026', '2026-10-24'],
      ['2027-02-28', '2027-02-28'],
    ]) {
      await type(text);
      expect(w!.emitted('update:modelValue')!.at(-1)).toEqual([iso]);
    }
    expect((field().element as HTMLInputElement).value).toBe('28.02.2027');
  });

  it('follows the US order in en-US', async () => {
    configure({ locale: 'en-US' });
    picker({ modelValue: '2026-10-24' });
    expect((field().element as HTMLInputElement).value).toBe('10/24/2026');
    await type('1/3/2027');
    expect(w!.emitted('update:modelValue')!.at(-1)).toEqual(['2027-01-03']);
    configure({ locale: 'de-DE' });
  });

  it('keeps text that isn’t a date, empties the value and says why', async () => {
    picker({
      modelValue: '2026-10-24',
      min: '2026-10-01',
      max: '2026-12-31',
      isDateDisabled: (d: string) => d === '2026-11-01',
    });
    await type('31.02.2026');
    expect(w!.emitted('update:modelValue')!.at(-1)).toEqual([null]);
    expect(w!.emitted('invalid-text')!.at(-1)).toEqual(['31.02.2026', 'format']);
    expect((field().element as HTMLInputElement).value).toBe('31.02.2026');
    await type('1.1.2027');
    expect(w!.emitted('invalid-text')!.at(-1)).toEqual(['1.1.2027', 'range']);
    await type('1.11.2026');
    expect(w!.emitted('invalid-text')!.at(-1)).toEqual(['1.11.2026', 'unavailable']);
    await type('');
    expect(w!.emitted('invalid-text')).toHaveLength(3);
  });

  it('replaces the text when the value is set from outside', async () => {
    picker({ modelValue: '2026-10-24' });
    await w!.setProps({ modelValue: '2027-01-03' });
    expect((field().element as HTMLInputElement).value).toBe('03.01.2027');
    await w!.setProps({ modelValue: null });
    expect((field().element as HTMLInputElement).value).toBe('');
  });

  it('opens a calendar dialog on the chosen month, focused on the chosen day', async () => {
    picker({ modelValue: '2026-10-24' });
    const button = w!.get('.q-datepicker__button');
    expect(button.attributes('aria-label')).toBe('Choose date');
    expect(button.attributes('aria-expanded')).toBe('false');
    await openCalendar();
    expect(button.attributes('aria-expanded')).toBe('true');
    const dialog = document.querySelector('[role="dialog"]')!;
    expect(dialog.getAttribute('aria-label')).toBe('Choose date');
    expect(dialog.querySelector('.q-datepicker__title')!.textContent).toBe('Oktober 2026');
    // The week starts on Monday in Germany.
    expect(Array.from(dialog.querySelectorAll('th')).map((t) => t.getAttribute('abbr'))[0]).toBe('Montag');
    const chosen = day(24);
    expect(chosen.getAttribute('aria-label')).toBe('Samstag, 24. Oktober 2026');
    expect(chosen.getAttribute('tabindex')).toBe('0');
    expect(chosen.closest('td')!.getAttribute('aria-selected')).toBe('true');
    expect(days().filter((d) => d.tabIndex === 0)).toHaveLength(1);
  });

  it('moves through the days with the keyboard and chooses with Enter', async () => {
    picker({ modelValue: '2026-10-24' });
    await openCalendar();
    day(24).focus();
    await key('ArrowRight');
    expect(focused()).toBe('Sonntag, 25. Oktober 2026');
    await key('ArrowDown');
    expect(focused()).toBe('Sonntag, 1. November 2026');
    expect(document.querySelector('.q-datepicker__title')!.textContent).toBe('November 2026');
    await key('Home');
    expect(focused()).toBe('Montag, 26. Oktober 2026');
    await key('End');
    expect(focused()).toBe('Sonntag, 1. November 2026');
    await key('PageDown');
    expect(focused()).toBe('Dienstag, 1. Dezember 2026');
    await key('PageUp', { shiftKey: true });
    expect(focused()).toBe('Montag, 1. Dezember 2025');
    await key('ArrowUp');
    expect(focused()).toBe('Montag, 24. November 2025');
    (document.activeElement as HTMLButtonElement).click();
    await nextTick();
    expect(w!.emitted('update:modelValue')!.at(-1)).toEqual(['2025-11-24']);
    expect((field().element as HTMLInputElement).value).toBe('24.11.2025');
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(w!.get('.q-datepicker__button').element);
  });

  it('clamps to min and max and doesn’t choose ruled-out days', async () => {
    picker({
      modelValue: null,
      min: '2026-10-20',
      max: '2026-11-10',
      isDateDisabled: (d: string) => d === '2026-10-25',
    });
    await openCalendar();
    const prev = document.querySelector<HTMLButtonElement>('[aria-label="Previous month"]')!;
    expect(prev.disabled).toBe(true);
    expect(day(19).getAttribute('aria-disabled')).toBe('true');
    expect(day(19).classList.contains('is-unavailable')).toBe(false);
    expect(day(25).classList.contains('is-unavailable')).toBe(true);
    day(25).click();
    await nextTick();
    expect(w!.emitted('update:modelValue')).toBeUndefined();
    day(20).focus();
    await key('PageUp');
    expect(focused()).toBe('Dienstag, 20. Oktober 2026');
    await key('PageDown', { shiftKey: true });
    expect(focused()).toBe('Dienstag, 10. November 2026');
  });

  it('switches months with the buttons', async () => {
    picker({ modelValue: '2026-01-31' });
    await openCalendar();
    document.querySelector<HTMLButtonElement>('[aria-label="Next month"]')!.click();
    await nextTick();
    expect(document.querySelector('.q-datepicker__title')!.textContent).toBe('Februar 2026');
    expect(day(28).getAttribute('tabindex')).toBe('0');
  });

  it('opens with Alt+↓ from the field', async () => {
    picker({ modelValue: '2026-10-24' });
    await field().trigger('keydown', { key: 'ArrowDown', altKey: true });
    await nextTick();
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
  });

  it('has no calendar button when read-only and a disabled one when disabled', async () => {
    picker({ modelValue: '2026-10-24', readonly: true });
    expect(w!.find('.q-datepicker__button').exists()).toBe(false);
    await w!.setProps({ readonly: false, disabled: true });
    expect(w!.get('.q-datepicker__button').attributes('disabled')).toBeDefined();
  });

  it('takes its id, label and description from a Field, and submits the ISO date under name', () => {
    w = mount(() =>
      h(QField, { label: 'Delivery date', hint: 'Monday to Saturday', required: true }, () =>
        h(QDatePicker, { modelValue: '2026-10-24', name: 'delivery' }),
      ),
    );
    const input = w.get('input.q-input__field');
    expect(input.attributes('id')).toBeTruthy();
    expect(w.get('label').attributes('for')).toBe(input.attributes('id'));
    expect(input.attributes('aria-describedby')).toBeTruthy();
    expect(input.attributes('aria-required')).toBe('true');
    expect(input.attributes('name')).toBeUndefined();
    expect(w.get('input[type="hidden"]').attributes()).toMatchObject({ name: 'delivery', value: '2026-10-24' });
  });

  it('takes translations', async () => {
    picker({ modelValue: null, strings: { choose: 'Datum auswählen', day: 'TT', month: 'MM', year: 'JJJJ' } });
    expect(field().attributes('placeholder')).toBe('TT.MM.JJJJ');
    expect(w!.get('.q-datepicker__button').attributes('aria-label')).toBe('Datum auswählen');
  });
});
