import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils';
import { QAppShell, QNav } from 'quiet';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';

enableAutoUnmount(afterEach);

const nav = () => h(QNav, { items: [{ label: 'Home', href: '#home', current: true }, { label: 'Orders', href: '#orders' }] });

function shell(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return mount(QAppShell, {
    props: { brand: 'Leinen & Co', toaster: false, ...props },
    slots: { nav, default: () => h('h1', 'Home'), ...slots },
    attachTo: document.body,
  });
}

describe('QAppShell', () => {
  it('renders the frame: skip link, top bar, side column, main', () => {
    const w = shell();
    const main = w.get('main');
    expect(main.classes()).toContain('q-shell__main');
    expect(main.attributes('tabindex')).toBe('-1');
    expect(main.attributes('id')).toMatch(/^q-main-/);
    const skip = w.get('a.q-shell__skip');
    expect(skip.text()).toBe('Skip to content');
    expect(skip.attributes('href')).toBe(`#${main.attributes('id')}`);
    expect(w.get('header.q-shell__topbar .q-shell__brand').text()).toBe('Leinen & Co');
    expect(w.get('.q-shell__side .q-shell__brand--side').text()).toBe('Leinen & Co');
    expect(w.find('.q-shell__side nav.q-nav').exists()).toBe(true);
    expect(main.text()).toBe('Home');
  });

  it('uses mainId and renders optional parts only when given', () => {
    const w = shell({ mainId: 'content', brand: undefined });
    expect(w.get('main').attributes('id')).toBe('content');
    expect(w.find('.q-shell__brand--side').exists()).toBe(false);
    expect(w.find('.q-shell__navfoot').exists()).toBe(false);
    expect(w.find('.q-shell__topend').exists()).toBe(false);
    const full = shell({}, { 'nav-footer': () => 'Anna Schulz', 'top-bar-end': () => h('button', { 'aria-label': 'Search' }) });
    expect(full.get('.q-shell__side .q-shell__navfoot').text()).toBe('Anna Schulz');
    expect(full.find('.q-shell__topend button').exists()).toBe(true);
  });

  it('skip link focuses main', async () => {
    const w = shell();
    await w.get('a.q-shell__skip').trigger('click');
    expect(document.activeElement).toBe(w.get('main').element);
  });

  it('opens the nav in a drawer from the named menu button and closes when a link is chosen', async () => {
    const w = shell({}, { 'nav-footer': () => 'Anna Schulz' });
    const menu = w.get('button.q-shell__menu');
    expect(menu.attributes('aria-label')).toBe('Menu');
    expect(menu.attributes('aria-expanded')).toBe('false');
    await menu.trigger('click');
    await flushPromises();
    expect(menu.attributes('aria-expanded')).toBe('true');
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]')!;
    expect(dialog.classList.contains('q-shell__drawerpanel')).toBe(true);
    expect(dialog.querySelector('.q-dialog__title')?.textContent).toBe('Leinen & Co');
    expect(dialog.querySelector('.q-shell__drawer .q-nav')).not.toBeNull();
    expect(dialog.querySelector('.q-shell__drawer .q-shell__navfoot')?.textContent).toBe('Anna Schulz');
    expect(dialog.querySelector('button[aria-label="Close menu"]')).not.toBeNull();
    dialog.querySelector<HTMLAnchorElement>('a[href="#orders"]')!.click();
    await flushPromises();
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(menu.attributes('aria-expanded')).toBe('false');
  });

  it('titles the drawer "Menu" without a brand, and takes strings', async () => {
    const w = shell({ brand: undefined, strings: { menu: 'Menü', skip: 'Zum Inhalt', closeMenu: 'Menü schließen' } });
    expect(w.get('a.q-shell__skip').text()).toBe('Zum Inhalt');
    await w.get('button.q-shell__menu').trigger('click');
    await flushPromises();
    expect(document.querySelector('.q-dialog__title')?.textContent).toBe('Menü');
    expect(document.querySelector('button[aria-label="Menü schließen"]')).not.toBeNull();
  });

  it('closes the drawer when the window grows to desktop', async () => {
    let listener: (() => void) | undefined;
    const mq = { matches: true, addEventListener: (_: string, fn: () => void) => (listener = fn), removeEventListener: vi.fn() };
    vi.spyOn(window, 'matchMedia').mockReturnValue(mq as unknown as MediaQueryList);
    const w = shell();
    await w.get('button.q-shell__menu').trigger('click');
    await flushPromises();
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    mq.matches = false;
    listener!();
    await nextTick();
    await flushPromises();
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders a Toaster unless toaster is false', () => {
    expect(shell({ toaster: true }).findComponent({ name: 'QToaster' }).exists()).toBe(true);
    expect(shell().findComponent({ name: 'QToaster' }).exists()).toBe(false);
  });
});
