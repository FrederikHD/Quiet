import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { QButton, QMenu, type MenuItem } from '@frederikhd/quiet';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';

enableAutoUnmount(afterEach);

const tick = () => new Promise((r) => setTimeout(r, 0));
const panelItems = () => Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]'));

async function openMenu(items: (MenuItem | null | false)[], extra: Record<string, unknown> = {}) {
  const w = mount(QMenu, { props: { label: 'Actions for #10530', items, ...extra }, attachTo: document.body });
  const trigger = w.get('button');
  await trigger.trigger('click');
  await flushPromises();
  await tick();
  await nextTick();
  return { w, trigger };
}

describe('QMenu', () => {
  it('renders a ghost ⋯ trigger named by the label, announcing a menu', async () => {
    const w = mount(QMenu, { props: { label: 'Actions for #10530', items: [{ label: 'Edit' }] }, attachTo: document.body });
    await nextTick();
    const b = w.get('button');
    expect(b.attributes('aria-label')).toBe('Actions for #10530');
    expect(b.classes()).toEqual(expect.arrayContaining(['q-btn--ghost', 'q-btn--icon', 'q-menu__more']));
    expect(b.attributes('aria-haspopup')).toBe('menu');
    expect(b.attributes('aria-expanded')).toBe('false');
    expect(document.querySelector('[role="menu"]')).toBeNull();
  });

  it('passes variant and size to the default trigger', () => {
    const w = mount(QMenu, { props: { label: 'More', items: [], variant: 'secondary', size: 'slim' }, attachTo: document.body });
    expect(w.get('button').classes()).toEqual(expect.arrayContaining(['q-btn--secondary', 'q-btn--slim']));
  });

  it('opens a labelled menu with items, dividers, icons and descriptions; skips null and false', async () => {
    const { trigger } = await openMenu([
      { label: 'Edit', icon: 'pencil' },
      null,
      false,
      { divider: true },
      { label: 'Archive', description: 'Hidden, kept in reports' },
      { label: 'Delete', danger: true },
    ]);
    expect(trigger.attributes('aria-expanded')).toBe('true');
    const menu = document.querySelector('[role="menu"]')!;
    expect(menu.getAttribute('aria-label')).toBe('Actions for #10530');
    expect(trigger.attributes('aria-controls')).toBe(menu.closest('.q-popover')!.id);
    expect(panelItems().map((i) => i.textContent?.trim())).toEqual(['Edit', 'ArchiveHidden, kept in reports', 'Delete']);
    expect(menu.querySelectorAll('[role="separator"]')).toHaveLength(1);
    expect(menu.querySelector('.q-menu__icon')?.getAttribute('aria-hidden')).toBe('true');
    expect(panelItems()[2].classList.contains('q-menu__item--danger')).toBe(true);
    panelItems().forEach((i) => expect(i.getAttribute('tabindex')).toBe('-1'));
  });

  it('moves focus into the first item and through the items with the keys', async () => {
    await openMenu([{ label: 'Edit' }, { label: 'Duplicate', disabled: true }, { label: 'Delete' }, { label: 'Archive' }]);
    const [edit, , del, archive] = panelItems();
    expect(document.activeElement).toBe(edit);
    const key = (k: string) => (document.activeElement as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
    key('ArrowDown');
    expect(document.activeElement).toBe(del); // the disabled one is skipped
    key('End');
    expect(document.activeElement).toBe(archive);
    key('ArrowDown');
    expect(document.activeElement).toBe(edit); // wraps
    key('ArrowUp');
    expect(document.activeElement).toBe(archive);
    key('Home');
    expect(document.activeElement).toBe(edit);
    key('d');
    expect(document.activeElement).toBe(del); // typeahead
  });

  it('chooses an item: calls onSelect, emits select, closes', async () => {
    const onSelect = vi.fn();
    const item = { label: 'Edit', onSelect };
    const { w, trigger } = await openMenu([item]);
    panelItems()[0].click();
    await flushPromises();
    expect(onSelect).toHaveBeenCalledOnce();
    expect(w.emitted('select')![0][0]).toEqual(item);
    expect(document.querySelector('[role="menu"]')).toBeNull();
    expect(trigger.attributes('aria-expanded')).toBe('false');
  });

  it('ignores a disabled item', async () => {
    const onSelect = vi.fn();
    const { w } = await openMenu([{ label: 'Edit shipping', disabled: true, onSelect }]);
    const it = panelItems()[0];
    expect(it.getAttribute('aria-disabled')).toBe('true');
    it.click();
    await flushPromises();
    expect(onSelect).not.toHaveBeenCalled();
    expect(w.emitted('select')).toBeUndefined();
    expect(document.querySelector('[role="menu"]')).not.toBeNull();
  });

  it('renders link items, without href while disabled', async () => {
    await openMenu([{ label: 'View in shop', href: '/p/1' }, { label: 'Old', href: '/old', disabled: true }]);
    const [a, b] = panelItems();
    expect(a.tagName).toBe('A');
    expect(a.getAttribute('href')).toBe('/p/1');
    expect(a.hasAttribute('type')).toBe(false);
    expect(b.hasAttribute('href')).toBe(false);
  });

  it('chooses a link item with Space, as with Enter', async () => {
    const onSelect = vi.fn((e: MouseEvent) => e.preventDefault());
    const { w } = await openMenu([{ label: 'View in shop', href: '/p/1', onSelect }]);
    const a = panelItems()[0];
    a.focus();
    const ev = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
    a.dispatchEvent(ev);
    await flushPromises();
    expect(ev.defaultPrevented).toBe(true);
    expect(onSelect).toHaveBeenCalledOnce();
    expect(w.emitted('select')).toHaveLength(1);
  });

  it('closes on Escape and gives focus back to the trigger', async () => {
    const { trigger } = await openMenu([{ label: 'Edit' }]);
    document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await flushPromises();
    expect(document.querySelector('[role="menu"]')).toBeNull();
    expect(document.activeElement).toBe(trigger.element);
  });

  it('takes your own trigger and item content', async () => {
    const w = mount(QMenu, {
      props: { label: 'More actions', items: [{ label: 'Print' }] },
      slots: {
        trigger: () => h(QButton, { iconEnd: 'chevron-down' }, () => 'More actions'),
        item: ({ item }: { item: MenuItem }) => h('strong', item.label),
      },
      attachTo: document.body,
    });
    await nextTick();
    const b = w.get('button');
    expect(b.text()).toBe('More actions');
    expect(b.attributes('aria-haspopup')).toBe('menu');
    await b.trigger('click');
    await flushPromises();
    expect(document.querySelector('.q-menu__label strong')?.textContent).toBe('Print');
  });
});
