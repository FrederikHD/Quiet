// Shared plumbing for overlays (Popover, Menu, Dialog, Combobox):
// - a stack of open layers, so only the topmost answers Escape;
// - the page lock under modal dialogs (scroll lock + inert), counted across dialogs so they can close in any order;
// - where focus goes back to when an overlay closes, even if the element that opened it is gone.
import { FOCUSABLE, isBrowser } from './dom';

const layers: string[] = [];
export function pushLayer(id: string): void {
  layers.push(id);
}
export function popLayer(id: string): void {
  const i = layers.lastIndexOf(id);
  if (i !== -1) layers.splice(i, 1);
}
export function isTopLayer(id: string): boolean {
  return layers[layers.length - 1] === id;
}
export function hasLayers(): boolean {
  return layers.length > 0;
}

// The last focused element and, if it sat in a popover, that popover's trigger — so closing a dialog opened from
// a menu item (gone by then) lands on the menu button.
const focusTrack: { el: Element | null; trigger: Element | null } = { el: null, trigger: null };
if (isBrowser) {
  document.addEventListener(
    'focusin',
    (e) => {
      const t = e.target as Element | null;
      const pop = t?.closest?.('.q-popover');
      focusTrack.el = t;
      focusTrack.trigger = pop?.id ? document.querySelector(`[aria-controls="${pop.id}"]`) : null;
    },
    true,
  );
}
export function lastFocusTrigger(): Element | null {
  return focusTrack.trigger;
}

/** The element focus should return to: the focused one, else the last one focused, else its popover's trigger. */
export function returnTarget(): Element | null {
  const a = document.activeElement;
  if (a && a !== document.body) return a;
  if (focusTrack.el?.isConnected) return focusTrack.el;
  if (focusTrack.trigger?.isConnected) return focusTrack.trigger;
  return null;
}

const modalPage = { count: 0, overflow: '', pad: '' };
export function lockPage(): void {
  const body = document.body;
  if (modalPage.count++ === 0) {
    modalPage.overflow = body.style.overflow;
    modalPage.pad = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
  }
}
export function unlockPage(): void {
  if (modalPage.count === 0) return;
  if (--modalPage.count === 0) {
    document.body.style.overflow = modalPage.overflow;
    document.body.style.paddingRight = modalPage.pad;
  }
}

const inertCounts = new Map<Element, number>();
/** Makes every top-level element but `keep` inert. The toaster stays live, so toasts are still announced. */
export function inertAllBut(keep: Element | null): Element[] {
  const mine: Element[] = [];
  for (const el of Array.from(document.body.children)) {
    if (el === keep || el.tagName === 'SCRIPT' || el.classList.contains('q-toaster')) continue;
    if (el.hasAttribute('inert') && !inertCounts.has(el)) continue; // someone else's
    inertCounts.set(el, (inertCounts.get(el) ?? 0) + 1);
    el.setAttribute('inert', '');
    mine.push(el);
  }
  return mine;
}
/** Releases only what inertAllBut made inert; anything inert before stays inert. */
export function releaseInert(mine: Element[]): void {
  for (const el of mine) {
    const c = (inertCounts.get(el) ?? 1) - 1;
    if (c <= 0) {
      inertCounts.delete(el);
      el.removeAttribute('inert');
    } else inertCounts.set(el, c);
  }
}

export interface FocusPlace {
  el: Element;
  tag: string;
  cls: string;
  chain: { parent: Element; next: Element | null; prev: Element | null }[];
}

/** Remembers where focus was, and enough of its surroundings to find a stand-in if it disappears. */
export function rememberPlace(el: Element | null): FocusPlace | null {
  if (!el || el === document.body) return null;
  const chain: FocusPlace['chain'] = [];
  for (let c: Element | null = el; c?.parentElement && c.parentElement !== document.body; c = c.parentElement) {
    chain.push({ parent: c.parentElement, next: c.nextElementSibling, prev: c.previousElementSibling });
  }
  return { el, tag: el.tagName, cls: typeof el.className === 'string' ? el.className : '', chain };
}

/**
 * Focus goes back where it came from. If that element is gone (its table row was deleted), it goes to the same
 * kind of control in the next item, else the previous one, else the nearest control around it, else `main`.
 */
export function restoreFocus(place: FocusPlace | null): void {
  if (!place) return;
  if (place.el.isConnected) {
    (place.el as HTMLElement).focus?.({ preventScroll: true });
    return;
  }
  const pick = (root: Element | null): HTMLElement | null => {
    if (!root?.isConnected) return null;
    const all = [...(root.matches(FOCUSABLE) ? [root] : []), ...Array.from(root.querySelectorAll(FOCUSABLE))].filter(
      (x) => x.getClientRects().length && !x.closest('[inert]'),
    ) as HTMLElement[];
    return all.find((x) => x.tagName === place.tag && x.className === place.cls) ?? all[0] ?? null;
  };
  for (const lvl of place.chain) {
    if (!lvl.parent.isConnected) continue;
    if (lvl.parent.tagName === 'MAIN' || lvl.parent.tagName === 'HTML') break;
    const t = pick(lvl.next) ?? pick(lvl.prev) ?? pick(lvl.parent);
    if (t) {
      t.focus({ preventScroll: true });
      return;
    }
  }
  const main = document.querySelector('main');
  if (main) {
    if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
    (main as HTMLElement).focus({ preventScroll: true });
  }
}
