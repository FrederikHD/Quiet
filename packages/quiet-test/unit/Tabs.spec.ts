import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { QTabs, type TabItem } from '@frederikhd/quiet';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';

enableAutoUnmount(afterEach);

const TABS: TabItem[] = [
  { value: 'details', label: 'Details' },
  { value: 'timeline', label: 'Timeline', count: 1240, countLabel: '1240 events' },
  { value: 'returns', label: 'Returns', disabled: true },
  { value: 'notes', label: 'Notes' },
];
const panels = {
  'panel-details': () => h('p', 'Details panel'),
  'panel-timeline': () => h('p', 'Timeline panel'),
  'panel-returns': () => null,
  'panel-notes': () => h('p', 'Notes panel'),
};
const key = (el: Element, k: string) =>
  el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));

describe('QTabs', () => {
  it('renders a labelled tablist with a panel per tab, the first one chosen', () => {
    const w = mount(QTabs, { props: { label: 'Order', tabs: TABS }, slots: panels });
    expect(w.classes()).toEqual(expect.arrayContaining(['q-tabs', 'q-tabs--line']));
    const list = w.get('[role="tablist"]');
    expect(list.attributes('aria-label')).toBe('Order');
    const tabs = w.findAll('[role="tab"]');
    expect(tabs).toHaveLength(4);
    expect(tabs[0].attributes('aria-selected')).toBe('true');
    expect(tabs[0].attributes('tabindex')).toBe('0');
    expect(tabs[1].attributes('aria-selected')).toBe('false');
    expect(tabs[1].attributes('tabindex')).toBe('-1');
    expect(tabs[2].attributes('disabled')).toBeDefined();
    const ps = w.findAll('[role="tabpanel"]');
    expect(ps).toHaveLength(4);
    expect(tabs[0].attributes('aria-controls')).toBe(ps[0].attributes('id'));
    expect(ps[0].attributes('aria-labelledby')).toBe(tabs[0].attributes('id'));
    expect(ps[0].attributes('hidden')).toBeUndefined();
    expect(ps[0].attributes('tabindex')).toBe('0');
    expect(ps[1].attributes('hidden')).toBeDefined();
    expect(ps[1].text()).toBe('Timeline panel'); // stays mounted
  });

  it('formats the count and reads what it means', () => {
    const w = mount(QTabs, { props: { label: 'Order', tabs: TABS }, slots: panels });
    const tab = w.findAll('[role="tab"]')[1];
    expect(tab.get('.q-tabs__count').text()).toBe('1,240');
    expect(tab.get('.q-tabs__count').attributes('aria-hidden')).toBe('true');
    expect(tab.get('.q-visually-hidden').text()).toBe(', 1240 events');
  });

  it('chooses on click and updates v-model', async () => {
    const w = mount(QTabs, { props: { label: 'Order', tabs: TABS, modelValue: 'details' }, slots: panels });
    await w.findAll('[role="tab"]')[1].trigger('click');
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual(['timeline']);
    await w.setProps({ modelValue: 'timeline' });
    expect(w.findAll('[role="tab"]')[1].attributes('aria-selected')).toBe('true');
    expect(w.findAll('[role="tabpanel"]')[1].attributes('hidden')).toBeUndefined();
  });

  it('starts at defaultValue, and falls back from a disabled or unknown value', () => {
    expect(
      mount(QTabs, { props: { label: 'O', tabs: TABS, defaultValue: 'notes' }, slots: panels })
        .find('[aria-selected="true"]')
        .text(),
    ).toBe('Notes');
    expect(
      mount(QTabs, { props: { label: 'O', tabs: TABS, modelValue: 'returns' }, slots: panels })
        .find('[aria-selected="true"]')
        .text(),
    ).toBe('Details');
    expect(
      mount(QTabs, { props: { label: 'O', tabs: TABS, modelValue: 'nope' }, slots: panels })
        .find('[aria-selected="true"]')
        .text(),
    ).toBe('Details');
  });

  it('arrow keys, Home and End move and choose, skipping disabled tabs', async () => {
    const w = mount(QTabs, { props: { label: 'Order', tabs: TABS }, slots: panels, attachTo: document.body });
    const tabs = w.findAll<HTMLElement>('[role="tab"]').map((t) => t.element);
    tabs[0].focus();
    key(tabs[0], 'ArrowRight');
    await nextTick();
    expect(document.activeElement).toBe(tabs[1]);
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    key(tabs[1], 'ArrowRight');
    await nextTick();
    expect(document.activeElement).toBe(tabs[3]);
    key(tabs[3], 'ArrowRight');
    await nextTick();
    expect(document.activeElement).toBe(tabs[0]);
    key(tabs[0], 'ArrowLeft');
    await nextTick();
    expect(document.activeElement).toBe(tabs[3]);
    key(tabs[3], 'Home');
    await nextTick();
    expect(document.activeElement).toBe(tabs[0]);
    key(tabs[0], 'End');
    await nextTick();
    expect(document.activeElement).toBe(tabs[3]);
    expect(tabs[3].getAttribute('aria-selected')).toBe('true');
  });

  it('manual activation moves focus without choosing', async () => {
    const w = mount(QTabs, {
      props: { label: 'Order', tabs: TABS, activation: 'manual' },
      slots: panels,
      attachTo: document.body,
    });
    const tabs = w.findAll<HTMLElement>('[role="tab"]').map((t) => t.element);
    tabs[0].focus();
    key(tabs[0], 'ArrowRight');
    await nextTick();
    expect(document.activeElement).toBe(tabs[1]);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(w.emitted('update:modelValue')?.some((e) => e[0] === 'timeline')).toBeFalsy();
  });

  it('shows one shared panel when no tab has its own', async () => {
    const w = mount(QTabs, {
      props: {
        label: 'Order views',
        tabs: [
          { value: 'all', label: 'All' },
          { value: 'open', label: 'Open' },
        ],
      },
      slots: { default: '<ul><li>#10530</li></ul>' },
    });
    const ps = w.findAll('[role="tabpanel"]');
    expect(ps).toHaveLength(1);
    const tabs = w.findAll('[role="tab"]');
    expect(tabs[0].attributes('aria-controls')).toBe(ps[0].attributes('id'));
    expect(tabs[1].attributes('aria-controls')).toBe(ps[0].attributes('id'));
    expect(ps[0].attributes('aria-labelledby')).toBe(tabs[0].attributes('id'));
    await tabs[1].trigger('click');
    expect(ps[0].attributes('aria-labelledby')).toBe(tabs[1].attributes('id'));
  });

  it('variant, fill, size and panelFocusable', () => {
    const w = mount(QTabs, {
      props: {
        label: 'Period',
        variant: 'segmented',
        fill: true,
        size: 'slim',
        panelFocusable: false,
        tabs: [{ value: '1', label: 'Today' }],
      },
      slots: { default: 'x' },
    });
    expect(w.classes()).toEqual(expect.arrayContaining(['q-tabs--segmented', 'q-tabs--fill', 'q-tabs--slim']));
    expect(w.get('[role="tabpanel"]').attributes('tabindex')).toBeUndefined();
  });

  it('link tabs are a nav with aria-current and no tab roles', async () => {
    const tabs = [
      { value: 'docs', label: 'Guidelines', href: '/docs' },
      { value: 'api', label: 'API', href: '/api' },
    ];
    const w = mount(QTabs, { props: { label: 'Sections', tabs, modelValue: 'api' }, slots: { default: 'Content' } });
    const nav = w.get('nav.q-tabs__bar');
    expect(nav.attributes('aria-label')).toBe('Sections');
    expect(w.find('[role="tablist"]').exists()).toBe(false);
    expect(w.find('[role="tab"]').exists()).toBe(false);
    expect(w.get('ul.q-tabs__list').attributes('aria-label')).toBeUndefined();
    const links = w.findAll('a.q-tabs__tab');
    expect(links[1].attributes('aria-current')).toBe('page');
    expect(links[0].attributes('aria-current')).toBeUndefined();
    expect(w.get('.q-tabs__panel--plain').text()).toBe('Content');
    await links[0].trigger('click');
    expect(w.emitted('navigate')![0][0]).toEqual(tabs[0]);
  });

  it('link tabs with null mark no tab as current', () => {
    const w = mount(QTabs, {
      props: { label: 'Shop', tabs: [{ value: 'a', label: 'A', href: '/a' }], modelValue: null },
    });
    expect(w.find('[aria-current]').exists()).toBe(false);
  });

  it('marks a tab whose panel holds an invalid field', async () => {
    const w = mount(QTabs, {
      props: {
        label: 'Settings',
        tabs: [
          { value: 'store', label: 'Store' },
          { value: 'contact', label: 'Contact' },
        ],
      },
      slots: { 'panel-store': () => h('input'), 'panel-contact': () => h('input', { 'aria-invalid': 'true' }) },
      attachTo: document.body,
    });
    await flushPromises();
    const contact = w.findAll('[role="tab"]')[1];
    expect(contact.classes()).toContain('is-invalid');
    expect(contact.find('.q-tabs__error').exists()).toBe(true);
    expect(contact.text()).toContain(', has errors');
    w.find('input[aria-invalid]').element.setAttribute('aria-invalid', 'false');
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();
    expect(w.findAll('[role="tab"]')[1].classes()).not.toContain('is-invalid');
  });

  it('opens the tab of a hidden panel that asks to be revealed', async () => {
    const w = mount(QTabs, {
      props: {
        label: 'Settings',
        tabs: [
          { value: 'store', label: 'Store' },
          { value: 'contact', label: 'Contact' },
        ],
      },
      slots: { 'panel-store': () => h('input'), 'panel-contact': () => h('input', { id: 'email' }) },
      attachTo: document.body,
    });
    await flushPromises();
    document.getElementById('email')!.dispatchEvent(new CustomEvent('q-reveal', { bubbles: true }));
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual(['contact']);
  });

  it('fades the edges of a row that scrolls, and keeps the chosen tab in view', async () => {
    const w = mount(QTabs, {
      props: { label: 'Product', tabs: TABS, modelValue: 'notes' },
      slots: panels,
      attachTo: document.body,
    });
    const list = w.get('.q-tabs__list').element as HTMLElement;
    Object.defineProperty(list, 'scrollWidth', { configurable: true, value: 500 });
    Object.defineProperty(list, 'clientWidth', { configurable: true, value: 300 });
    list.scrollLeft = 0;
    list.dispatchEvent(new Event('scroll'));
    await nextTick();
    expect(w.get('.q-tabs__bar').classes()).toEqual(expect.arrayContaining(['is-end']));
    expect(w.get('.q-tabs__bar').classes()).not.toContain('is-start');
    list.scrollLeft = 100;
    list.dispatchEvent(new Event('scroll'));
    await nextTick();
    expect(w.get('.q-tabs__bar').classes()).toEqual(expect.arrayContaining(['is-start', 'is-end']));
    list.scrollLeft = 200;
    list.dispatchEvent(new Event('scroll'));
    await nextTick();
    expect(w.get('.q-tabs__bar').classes()).not.toContain('is-end');

    // The chosen tab, beyond the right edge, is scrolled into view.
    const details = w.findAll('[role="tab"]')[0].element as HTMLElement;
    Object.defineProperty(details, 'offsetLeft', { configurable: true, value: 0 });
    Object.defineProperty(details, 'offsetWidth', { configurable: true, value: 80 });
    await w.setProps({ modelValue: 'details' });
    await nextTick();
    expect(list.scrollLeft).toBe(0);
  });

  it('observes the tabs themselves, so a late font or new count re-measures', async () => {
    const observed: Element[] = [];
    class RO {
      constructor(_: ResizeObserverCallback) {}
      observe(el: Element) {
        observed.push(el);
      }
      disconnect() {
        observed.length = 0;
      }
      unobserve() {}
    }
    vi.stubGlobal('ResizeObserver', RO);
    const w = mount(QTabs, { props: { label: 'Product', tabs: TABS }, slots: panels, attachTo: document.body });
    expect(observed).toContain(w.get('.q-tabs__list').element);
    expect(observed.filter((e) => e.classList.contains('q-tabs__tab'))).toHaveLength(4);
    await w.setProps({ tabs: [...TABS, { value: 'more', label: 'More' }] });
    await nextTick();
    expect(observed.filter((e) => e.classList.contains('q-tabs__tab'))).toHaveLength(5);
    vi.unstubAllGlobals();
  });

  it('translates "has errors"', async () => {
    const w = mount(QTabs, {
      props: { label: 'S', strings: { hasErrors: 'fehlerhaft' }, tabs: [{ value: 'a', label: 'A' }] },
      slots: { 'panel-a': () => h('input', { 'aria-invalid': 'true' }) },
      attachTo: document.body,
    });
    await flushPromises();
    expect(w.get('[role="tab"]').text()).toContain(', fehlerhaft');
  });
});
