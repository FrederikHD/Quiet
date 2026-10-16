import { onBeforeUnmount, ref, watchEffect, type Ref } from 'vue';

/** Whether a media query matches, kept up to date. */
export function useMediaQuery(query: () => string): Ref<boolean> {
  const matches = ref(false);
  let mql: MediaQueryList | null = null;
  const update = () => {
    matches.value = !!mql?.matches;
  };
  const stop = watchEffect((onCleanup) => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    mql = window.matchMedia(query());
    update();
    mql.addEventListener('change', update);
    onCleanup(() => mql?.removeEventListener('change', update));
  });
  onBeforeUnmount(stop);
  return matches;
}
