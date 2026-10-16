<script setup lang="ts">
import { computed } from 'vue';
import QLead from '../../internal/QLead.vue';
import type { IconName } from '../Icon/icons';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'info' | 'danger' | 'sale';

export interface BadgeProps {
  /** success Paid/Fulfilled/In stock · warning Pending/Unfulfilled/Low stock · info Processing/Shipped · danger Failed/Cancelled/Out of stock · neutral (default) Draft/Archived/Refunded · sale the storefront Sale tag. */
  tone?: BadgeTone;
  /** Optional 14px icon before the word. */
  icon?: IconName;
}

const props = withDefaults(defineProps<BadgeProps>(), { tone: 'neutral', icon: undefined });
defineSlots<{ /** The word: one or two, never colour alone. */ default(): unknown }>();

const TONES: BadgeTone[] = ['neutral', 'success', 'warning', 'info', 'danger', 'sale'];
const tone = computed(() => (TONES.includes(props.tone) ? props.tone : 'neutral'));
</script>

<template>
  <span :class="['q-badge', `q-badge--${tone}`]">
    <QLead v-if="icon" :icon="icon" />
    <span class="q-badge__label"><slot /></span>
  </span>
</template>
