<script setup lang="ts">
// Where toasts show: top centre, above everything, under a phone top bar. One per app (AppShell includes one).
// The live regions exist before any toast appears, so the first one is announced too; errors are assertive.
import { computed } from 'vue';
import { useStrings } from '../../config';
import QToastItem from './QToastItem.vue';
import { toastState } from './store';

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
</script>

<template>
  <Teleport to="body">
    <section class="q-toaster" :aria-label="strings.region">
      <div role="status" class="q-toaster__stack">
        <QToastItem v-for="t in polite" :key="t.id" :toast="t" :dismiss-label="strings.dismiss" />
      </div>
      <div role="alert" class="q-toaster__stack">
        <QToastItem v-for="t in urgent" :key="t.id" :toast="t" :dismiss-label="strings.dismiss" />
      </div>
    </section>
  </Teleport>
</template>
