import { onBeforeUnmount, watch, type Ref } from 'vue';

// Sticky bars cover the page edge. Their height becomes the page's scroll padding, so the browser scrolls a
// focused field clear of them instead of leaving it underneath (WCAG 2.4.11). Toasts also move below a top bar.
const pads: Record<'top' | 'bottom', HTMLElement[]> = { top: [], bottom: [] };

function apply(side: 'top' | 'bottom') {
  let max = 0;
  for (const el of pads[side]) max = Math.max(max, el.getBoundingClientRect().height);
  const root = document.documentElement;
  if (max) root.style.setProperty(`--q-sticky-${side}`, `${Math.ceil(max) + 8}px`);
  else root.style.removeProperty(`--q-sticky-${side}`);
}

// A bar inside a scrolling box (a form in an overflow: auto panel) covers that box's edge, not the page's.
function scrollParent(node: HTMLElement): HTMLElement | null {
  for (let p = node.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
    if (/(auto|scroll|overlay)/.test(getComputedStyle(p).overflowY)) return p;
  }
  return null;
}

/** For your own sticky bars, too: `useStickyPad(barRef, 'bottom')`. */
export function useStickyPad(
  el: Ref<HTMLElement | null | undefined>,
  side: 'top' | 'bottom' = 'top',
  active: () => boolean = () => true,
): void {
  let cleanup: (() => void) | null = null;
  const stop = watch(
    [el, active],
    ([node, on]) => {
      cleanup?.();
      cleanup = null;
      if (!node || !on || typeof window === 'undefined') return;
      pads[side].push(node);
      const box = scrollParent(node);
      const prop = `scroll-padding-${side}`;
      const prev = box?.style.getPropertyValue(prop) ?? '';
      const restore = () => (prev ? box?.style.setProperty(prop, prev) : box?.style.removeProperty(prop));
      const update = () => {
        apply(side);
        const h = node.getBoundingClientRect().height;
        if (!box) return;
        if (h) box.style.setProperty(prop, `${Math.ceil(h) + 8}px`);
        else restore();
      };
      update();
      const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
      ro?.observe(node);
      cleanup = () => {
        ro?.disconnect();
        pads[side] = pads[side].filter((x) => x !== node);
        apply(side);
        restore();
      };
    },
    { immediate: true, flush: 'post' },
  );
  onBeforeUnmount(() => {
    stop();
    cleanup?.();
  });
}
