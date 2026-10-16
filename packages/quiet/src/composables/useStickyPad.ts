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
      apply(side);
      const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => apply(side)) : null;
      ro?.observe(node);
      cleanup = () => {
        ro?.disconnect();
        pads[side] = pads[side].filter((x) => x !== node);
        apply(side);
      };
    },
    { immediate: true, flush: 'post' },
  );
  onBeforeUnmount(() => {
    stop();
    cleanup?.();
  });
}
