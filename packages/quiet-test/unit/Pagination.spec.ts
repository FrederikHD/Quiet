import { enableAutoUnmount, mount } from '@vue/test-utils';
import { QPagination, configure } from '@frederikhd/quiet';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

enableAutoUnmount(afterEach);
beforeAll(() => configure({ locale: 'en-US' }));

const pager = (props: Record<string, unknown> = {}) =>
  mount(QPagination, { props: { total: 1240, ...props } as never, attachTo: document.body });

describe('QPagination', () => {
  it('is a named nav with the range, previous and next (simple by default)', () => {
    const w = pager();
    const nav = w.get('nav');
    expect(nav.attributes('aria-label')).toBe('Pagination');
    expect(nav.classes()).toContain('q-pager--simple');
    expect(w.get('.q-pager__range').text()).toBe('1–50 of 1,240');
    expect(w.get('.q-pager__range').attributes('aria-hidden')).toBe('true');
    expect(w.get('.q-pager__prev').attributes('aria-label')).toBe('Previous page');
    expect(w.get('.q-pager__prev').attributes('disabled')).toBeDefined();
    expect(w.get('.q-pager__next').attributes('disabled')).toBeUndefined();
    expect(w.get('[role="status"]').text()).toBe('1–50 of 1,240');
    expect(w.get('.q-pager__row').classes()).toContain('q-pager__row--end');
  });

  it('moves with next and previous and emits update:page', async () => {
    const w = pager({ page: 2 });
    await w.get('.q-pager__next').trigger('click');
    expect(w.emitted('update:page')![0]).toEqual([3]);
    // Unbound, v-model keeps the page itself: 3, then back to 2.
    await w.get('.q-pager__prev').trigger('click');
    expect(w.emitted('update:page')![1]).toEqual([2]);
  });

  it('works uncontrolled through v-model and clamps the page', async () => {
    const w = pager({ page: 99, pageSize: 100 });
    expect(w.get('.q-pager__range').text()).toBe('1,201–1,240 of 1,240');
    expect(w.get('.q-pager__next').attributes('disabled')).toBeDefined();
  });

  it('shows numbered pages with gaps and marks the current one', () => {
    const w = pager({ variant: 'pages', page: 6, pageSize: 50 });
    const items = w.findAll('.q-pager__pages > *').map((e) => e.text());
    expect(items).toEqual(['1', '…', '5', '6', '7', '…', '25']);
    const cur = w.get('[aria-current="page"]');
    expect(cur.text()).toBe('6');
    expect(cur.attributes('aria-label')).toBe('Page 6');
    expect(w.get('.q-pager__gap').attributes('aria-hidden')).toBe('true');
    expect(w.get('.q-pager__compact--fallback').text()).toBe('6 / 25');
  });

  it('honours siblings', () => {
    const w = pager({ variant: 'pages', page: 10, siblings: 2 });
    expect(w.findAll('.q-pager__pages > *').map((e) => e.text())).toEqual([
      '1',
      '…',
      '8',
      '9',
      '10',
      '11',
      '12',
      '…',
      '25',
    ]);
  });

  it('adds first and last, and the compact display', async () => {
    const w = pager({ variant: 'compact', showFirstLast: true, page: 4 });
    expect(w.get('.q-pager__compact').text()).toBe('4 / 25');
    await w.get('.q-pager__last').trigger('click');
    expect(w.emitted('update:page')![0]).toEqual([25]);
    await w.get('.q-pager__first').trigger('click');
    expect(w.emitted('update:page')![1]).toEqual([1]);
  });

  it('stays simple without a total and uses hasNext', () => {
    const w = mount(QPagination, { props: { variant: 'pages', pageSize: 25, page: 2, hasNext: false } });
    expect(w.classes()).toContain('q-pager--simple');
    expect(w.get('.q-pager__range').text()).toBe('26–50');
    expect(w.get('.q-pager__next').attributes('disabled')).toBeDefined();
  });

  it('jumps to a typed page on Enter, clamped, and restores an empty field', async () => {
    const w = pager({ variant: 'compact', jumpToPage: true, page: 3 });
    const input = w.get('.q-pager__jump input');
    expect(w.get('label.q-pager__jump-label').attributes('for')).toBe(input.attributes('id'));
    expect(w.get('.q-pager__of').text()).toBe('of 25');
    await input.setValue('40');
    await input.trigger('keydown', { key: 'Enter' });
    expect(w.emitted('update:page')![0]).toEqual([25]);
    await input.setValue('');
    await input.trigger('blur');
    expect((input.element as HTMLInputElement).value).toBe('25');
  });

  it('shows a rows-per-page select with page-size options, unless showPageSize is false', async () => {
    const w = pager({ pageSizeOptions: [25, 50, 100] });
    const sel = w.get('.q-pager__size select');
    expect(w.get('label.q-pager__size-label').text()).toBe('Rows per page');
    await sel.setValue('100');
    expect(w.emitted('update:pageSize')![0]).toEqual([100]);
    expect(w.get('.q-pager__range').text()).toBe('1–100 of 1,240');
    expect(
      pager({ pageSizeOptions: [25, 50], showPageSize: false })
        .find('.q-pager__size')
        .exists(),
    ).toBe(false);
  });

  it('announces the page when the range is hidden', () => {
    const w = pager({ showRange: false, page: 2 });
    expect(w.find('.q-pager__range').exists()).toBe(false);
    expect(w.get('[role="status"]').text()).toBe('Page 2 of 25');
  });

  it('disables every control and sets aria-busy while disabled', async () => {
    const w = pager({ variant: 'pages', disabled: true, page: 2 });
    expect(w.attributes('aria-busy')).toBe('true');
    expect(w.get('.q-pager__next').attributes('disabled')).toBeDefined();
    await w.get('.q-pager__next').trigger('click');
    expect(w.emitted('update:page')).toBeUndefined();
  });

  it('renders links with hrefFor', () => {
    const w = pager({ variant: 'pages', page: 2, hrefFor: (n: number) => `?page=${n}` });
    expect(w.get('a.q-pager__next').attributes('href')).toBe('?page=3');
    expect(w.get('a.q-pager__prev').attributes('href')).toBe('?page=1');
  });

  it('keeps focus inside when the pressed button turns disabled', async () => {
    const w = pager({ variant: 'pages', page: 24 });
    const next = w.get<HTMLButtonElement>('.q-pager__next');
    next.element.focus();
    await next.trigger('click');
    await nextTick();
    await nextTick();
    expect(document.activeElement?.getAttribute('aria-current')).toBe('page');
    expect(document.activeElement?.textContent?.trim()).toBe('25');
  });

  it('applies size and align, and takes translations', () => {
    const w = pager({ size: 'large', align: 'between', strings: { next: 'Nächste Seite' } });
    expect(w.get('.q-pager__next').classes()).toContain('q-btn--large');
    expect(w.get('.q-pager__row').classes()).toContain('q-pager__row--between');
    expect(w.get('.q-pager__next').attributes('aria-label')).toBe('Nächste Seite');
  });
});

describe('QPagination (audit fixes)', () => {
  it('leaves modified clicks on links to the browser', async () => {
    const w = pager({ page: 2, hrefFor: (n: number) => `?page=${n}` });
    const next = w.get('a.q-pager__next');
    for (const mod of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) {
      const e = new MouseEvent('click', { bubbles: true, cancelable: true, ...mod });
      next.element.dispatchEvent(e);
      expect(e.defaultPrevented).toBe(false);
    }
    expect(w.emitted('update:page')).toBeUndefined();
    await next.trigger('click');
    expect(w.emitted('update:page')![0]).toEqual([3]);
  });

  it('keeps the first visible row when the page size changes, and writes the page back', async () => {
    const w = pager({ page: 3, pageSize: 50, pageSizeOptions: [25, 50, 100] });
    await w.get('select').setValue('100');
    expect(w.emitted('update:pageSize')!.at(-1)).toEqual([100]);
    // Rows 101–150 were shown: 101 is on page 2 of 100.
    expect(w.emitted('update:page')!.at(-1)).toEqual([2]);
    const end = pager({ page: 25, pageSize: 50, pageSizeOptions: [25, 50, 100] });
    await end.get('select').setValue('100');
    expect(end.emitted('update:page')!.at(-1)).toEqual([13]);
  });

  it('keeps the focused control focusable while disabled (simple variant)', async () => {
    const w = pager({ page: 2 });
    const next = w.get<HTMLButtonElement>('.q-pager__next');
    next.element.focus();
    await w.setProps({ disabled: true });
    expect(next.attributes('disabled')).toBeUndefined();
    expect(next.attributes('aria-disabled')).toBe('true');
    expect(w.get('.q-pager__prev').attributes('disabled')).toBeDefined();
    expect(document.activeElement).toBe(next.element);
    await next.trigger('click');
    expect(w.emitted('update:page')).toBeUndefined();
    await w.setProps({ disabled: false });
    expect(next.attributes('aria-disabled')).toBeUndefined();
    expect(next.attributes('disabled')).toBeUndefined();
  });

  it('finds a focusable control when the page changes while loading', async () => {
    const w = pager({ variant: 'compact', page: 24 });
    const next = w.get<HTMLButtonElement>('.q-pager__next');
    next.element.focus();
    await next.trigger('click');
    await w.setProps({ disabled: true });
    await nextTick();
    await nextTick();
    await nextTick();
    expect(document.activeElement).toBe(w.get('.q-pager__prev').element);
    expect(w.get('.q-pager__prev').attributes('aria-disabled')).toBe('true');
  });
});
