<script setup lang="ts">
// Where toasts show: top centre, above everything, under a phone top bar. One per app (AppShell includes one).
// The live regions exist before any toast appears, so the first one is announced too; errors are assertive.
import { computed, onBeforeUnmount, onMounted, provide, ref } from 'vue';
import { useStrings } from '../../config';
import QToastItem from './QToastItem.vue';
import { toastHandBackKey, toastState } from './store';

export interface ToasterStrings {
  /** The × on each toast. Default "Dismiss". */
  dismiss?: string;
  /** Names the toast region for screen readers. Default "Notifications". */
  region?: string;
}
export interface ToasterProps {
  /** Translations: { dismiss: 'Dismiss', region: 'Notifications' }; or once for the shop with configure({ strings: { toast } }). */
  strings?: ToasterStrings;
}
const props = withDefaults(defineProps<ToasterProps>(), { strings: undefined });

const strings = useStrings<Required<ToasterStrings>>(
  'toast',
  { dismiss: 'Dismiss', region: 'Notifications' },
  () => props.strings,
);
const polite = computed(() => toastState.list.filter((t) => t.tone !== 'error'));
const urgent = computed(() => toastState.list.filter((t) => t.tone === 'error'));

// Where focus was before it came into the toaster (the last element focused outside it), so a keyboard user who
// pressed Undo or × goes back there.
const region = ref<HTMLElement | null>(null);
let cameFrom: HTMLElement | null = null;
function onFocusIn(e: FocusEvent) {
  const t = e.target as HTMLElement | null;
  if (t && t !== document.body && !region.value?.contains(t)) cameFrom = t;
}
onMounted(() => document.addEventListener('focusin', onFocusIn, true));
onBeforeUnmount(() => document.removeEventListener('focusin', onFocusIn, true));
// A toast is about to go with focus inside it: back to where focus came from, else the next toast's first button,
// else the page's main content.
function handBack(toastEl: HTMLElement) {
  if (!toastEl.contains(document.activeElement)) return;
  const back = cameFrom?.isConnected && !cameFrom.closest('[inert]') ? cameFrom : null;
  const all = Array.from(region.value?.querySelectorAll<HTMLElement>('.q-toast') ?? []);
  const i = all.indexOf(toastEl);
  const others = [...all.slice(i + 1), ...all.slice(0, Math.max(0, i)).reverse()].filter((t) => t !== toastEl);
  const next = others.map((t) => t.querySelector<HTMLElement>('button')).find(Boolean) ?? null;
  const main = document.querySelector<HTMLElement>('main, [role="main"]');
  const target = back ?? next ?? main;
  if (target && target === main && !main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
  target?.focus({ preventScroll: true });
}
provide(toastHandBackKey, handBack);
</script>

<template>
  <Teleport to="body">
    <section ref="region" class="q-toaster" :aria-label="strings.region">
      <div role="status" class="q-toaster__stack">
        <QToastItem v-for="t in polite" :key="t.id" :toast="t" :dismiss-label="strings.dismiss" />
      </div>
      <div role="alert" class="q-toaster__stack">
        <QToastItem v-for="t in urgent" :key="t.id" :toast="t" :dismiss-label="strings.dismiss" />
      </div>
    </section>
  </Teleport>
</template>
