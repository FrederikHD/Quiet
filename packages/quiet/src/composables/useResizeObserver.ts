import { onBeforeUnmount, watch, type Ref } from 'vue';

/** Runs callback now and whenever the element (or the extra ones) change size. */
export function useResizeObserver(
  el: Ref<Element | null | undefined>,
  callback: () => void,
  extra: () => (Element | null | undefined)[] = () => [],
): void {
  let ro: ResizeObserver | null = null;
  const stop = watch(
    el,
    (node) => {
      ro?.disconnect();
      ro = null;
      if (!node) return;
      callback();
      if (typeof ResizeObserver === 'undefined') return;
      ro = new ResizeObserver(() => callback());
      ro.observe(node);
      for (const x of extra()) if (x) ro.observe(x);
    },
    { immediate: true, flush: 'post' },
  );
  onBeforeUnmount(() => {
    stop();
    ro?.disconnect();
  });
}
