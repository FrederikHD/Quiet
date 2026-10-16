<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { useStrings } from '../../config';
import QTag from '../Tag/QTag.vue';

export interface FilterChip {
  key: string;
  label: string;
  /** A colour dot before the label. */
  swatch?: string;
}
export interface FilterChipsProps {
  items: (FilterChip | null | false)[];
  /** Shows "Clear all" from two chips up (emits `clear`). */
  clearable?: boolean;
  /** Where focus goes when the last chip is removed (default: the chip list itself). */
  emptyFocus?: HTMLElement | null;
  strings?: { label?: string; remove?: (label: string) => string; clear?: string };
}

const props = withDefaults(defineProps<FilterChipsProps>(), { clearable: true, emptyFocus: undefined, strings: undefined });
const emit = defineEmits<{ remove: [key: string]; clear: [] }>();

const strings = useStrings(
  'filterChips',
  { label: 'Active filters', remove: (l: string) => `Remove filter: ${l}`, clear: 'Clear all' },
  () => props.strings,
);
const root = ref<HTMLElement | null>(null);
const items = computed(() => props.items.filter((x): x is FilterChip => !!x));

// After a removal focus moves to the next chip, then to Clear all, then to the list itself — never lost.
async function refocus(i: number) {
  await nextTick();
  const r = root.value;
  if (!r) return;
  const chips = r.querySelectorAll<HTMLElement>('.q-tag');
  (chips[Math.min(i, chips.length - 1)] ?? r.querySelector<HTMLElement>('.q-fchips__clear') ?? props.emptyFocus ?? r).focus();
}
function remove(key: string, i: number) {
  emit('remove', key);
  void refocus(i);
}
function clear() {
  emit('clear');
  void refocus(0);
}
</script>

<template>
  <div ref="root" :class="['q-fchips', !items.length && 'is-empty']" tabindex="-1" role="group" :aria-label="strings.label">
    <ul v-if="items.length" class="q-fchips__list">
      <li v-for="(it, i) in items" :key="it.key" class="q-fchips__item">
        <QTag :swatch="it.swatch" removable :remove-label="strings.remove(it.label)" @remove="remove(it.key, i)">{{ it.label }}</QTag>
      </li>
    </ul>
    <button v-if="items.length > 1 && clearable" type="button" class="q-fchips__clear" @click="clear">{{ strings.clear }}</button>
  </div>
</template>
