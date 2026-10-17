<script setup lang="ts">
import { ref } from 'vue';
import { useStickyPad } from '../../composables/useStickyPad';

export interface FormActionsProps {
  /** end (default): buttons on the right, primary last. start, or between (e.g. Delete on the left, Cancel + Save on the right). */
  align?: 'end' | 'start' | 'between';
  /** Sticks to the bottom of the scroll area — long back-office forms. */
  sticky?: boolean;
}

const props = withDefaults(defineProps<FormActionsProps>(), { align: 'end' });
defineSlots<{
  /** The buttons, primary last. With align="between", wrap the right-hand ones in a <div>. */
  default(): unknown;
}>();

const root = ref<HTMLElement | null>(null);
useStickyPad(root, 'bottom', () => props.sticky);
</script>

<template>
  <div ref="root" :class="['q-factions', sticky && 'q-factions--sticky']">
    <div :class="['q-factions__row', `q-factions__row--${align}`]"><slot /></div>
  </div>
</template>
