import { mount } from '@vue/test-utils';
import { QField, QFieldGroup, QForm, QInput } from '@frederikhd/quiet';
import { describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';

const fields = () => [
  h(QField, { id: 'title', label: 'Title', error: 'Enter a title' }, () => h(QInput)),
  h(QFieldGroup, { id: 'dims', label: 'Size' }, () => [
    h(QField, { label: 'Length' }, () => h(QInput)),
    h(QField, { label: 'Width' }, () => h(QInput)),
  ]),
];

describe('QForm', () => {
  it('is a form with validation bubbles off, density and label width', () => {
    const w = mount(QForm, { props: { density: 'compact', labelWidth: '160px' }, slots: { default: fields } });
    const form = w.get('form');
    expect(form.classes()).toContain('q-form');
    expect(form.attributes('novalidate')).toBeDefined();
    expect(form.attributes('data-density')).toBe('compact');
    expect(form.attributes('style')).toContain('--q-label-w: 160px');
  });

  it('can leave native validation on', () => {
    const w = mount(QForm, { props: { noValidate: false } });
    expect(w.get('form').attributes('novalidate')).toBeUndefined();
  });

  it('emits submit with the event', async () => {
    const w = mount(QForm);
    await w.get('form').trigger('submit');
    expect(w.emitted('submit')).toHaveLength(1);
    expect(w.emitted('submit')![0][0]).toBeInstanceOf(Event);
  });

  it('lists errors in a labelled summary that links to each control', async () => {
    const w = mount(QForm, {
      props: {
        errors: [
          { id: 'title', message: 'Enter a title' },
          { id: 'dims', message: 'Enter the size' },
          { message: 'Try again later' },
        ],
      },
      slots: { default: fields },
      attachTo: document.body,
    });
    await nextTick();
    const summary = w.get('.q-form__summary');
    expect(summary.attributes('role')).toBe('region');
    expect(summary.attributes('tabindex')).toBe('-1');
    const titleId = summary.attributes('aria-labelledby')!;
    expect(w.get(`#${titleId}`).text()).toBe('Please fix the following');
    const links = summary.findAll('a');
    expect(links.map((a) => a.attributes('href'))).toEqual(['#title', '#dims']);
    expect(summary.findAll('li')[2].text()).toBe('Try again later');

    await links[0].trigger('click');
    expect(document.activeElement?.id).toBe('title');
    // A group's id lands on its first control.
    await links[1].trigger('click');
    expect(document.activeElement).toBe(w.findAll('.q-fgroup input')[0].element);
    w.unmount();
  });

  it('focuses the summary when errors appear and after each submit, not while they are edited', async () => {
    const w = mount(QForm, { slots: { default: fields }, attachTo: document.body });
    await w.setProps({ errors: [{ id: 'title', message: 'Enter a title' }] });
    await nextTick();
    const summary = w.get('.q-form__summary').element;
    expect(document.activeElement).toBe(summary);

    (w.get('#title').element as HTMLElement).focus();
    await w.setProps({ errors: [{ id: 'title', message: 'Still wrong' }] });
    await nextTick();
    expect(document.activeElement?.id).toBe('title');

    await w.get('form').trigger('submit');
    await nextTick();
    await nextTick();
    expect(document.activeElement).toBe(w.get('.q-form__summary').element);
    w.unmount();
  });

  it('focuses a summary that is there from the start', async () => {
    const w = mount(QForm, {
      props: { errors: [{ id: 'title', message: 'Enter a title' }] },
      slots: { default: fields },
      attachTo: document.body,
    });
    await nextTick();
    await nextTick();
    expect(document.activeElement).toBe(w.get('.q-form__summary').element);
    w.unmount();
  });

  it('leaves focus alone with focusErrorSummary=false and makes the summary an alert', async () => {
    const w = mount(QForm, {
      props: { focusErrorSummary: false },
      slots: { default: fields },
      attachTo: document.body,
    });
    (w.get('#title').element as HTMLElement).focus();
    await w.setProps({ errors: [{ id: 'title', message: 'Enter a title' }] });
    await nextTick();
    expect(w.get('.q-form__summary').attributes('role')).toBe('alert');
    expect(document.activeElement?.id).toBe('title');
    w.unmount();
  });

  it('quiets the field live regions while the summary shows', async () => {
    const w = mount(QForm, { slots: { default: fields } });
    expect(w.get('.q-field__live').attributes('aria-live')).toBe('polite');
    await w.setProps({ errors: [{ id: 'title', message: 'Enter a title' }] });
    expect(w.get('.q-field__live').attributes('aria-live')).toBe('off');
  });

  it('translates the summary title', () => {
    const w = mount(QForm, {
      props: { errors: [{ message: 'x' }], strings: { errorSummaryTitle: 'Bitte korrigieren' } },
    });
    expect(w.get('.q-form__summary-title').text()).toBe('Bitte korrigieren');
  });

  it('asks a hidden target to reveal itself before focusing it', async () => {
    vi.useFakeTimers();
    const w = mount(QForm, {
      props: { errors: [{ id: 'title', message: 'Enter a title' }] },
      slots: { default: fields },
      attachTo: document.body,
    });
    await nextTick();
    const target = w.get('#title').element as HTMLElement;
    target.getClientRects = () => [] as unknown as DOMRectList;
    const reveal = vi.fn();
    w.element.addEventListener('q-reveal', reveal);
    await w.get('.q-form__summary a').trigger('click');
    expect(reveal).toHaveBeenCalled();
    vi.runAllTimers();
    expect(document.activeElement).toBe(target);
    vi.useRealTimers();
    w.unmount();
  });
});
