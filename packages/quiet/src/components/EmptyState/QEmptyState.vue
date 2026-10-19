<script setup lang="ts">
import { useSlots } from 'vue';
import QIcon from '../Icon/QIcon.vue';
import type { IconName } from '../Icon/icons';

export interface EmptyStateProps {
  /** Says what's empty, specifically: "No results for “lnen”" (or use the `title` slot). */
  title: string;
  /** Default "search"; null for none. */
  icon?: IconName | null;
  /** Default 2; 1 when it is the whole page (a 404). */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** small: less padding, for a card or a section of a page (no reviews yet) rather than the whole view. */
  size?: 'default' | 'small';
  /** "status" when it replaces results after a search or filter, so the change is announced. */
  role?: string;
}

withDefaults(defineProps<EmptyStateProps>(), { icon: 'search', headingLevel: 2, size: 'default', role: undefined });
defineSlots<{
  /** The why and what-next, in ink-muted. */
  default?(): unknown;
  /** A rich title, in place of the title prop. */
  title?(): unknown;
  /** Up to two Buttons: Clear filters, See all products. */
  actions?(): unknown;
}>();
const slots = useSlots();
</script>

<template>
  <div :class="['q-empty', size === 'small' && 'q-empty--small']" :role="role">
    <span v-if="icon !== null" class="q-empty__icon" aria-hidden="true"
      ><QIcon :name="icon || 'search'" size="lg"
    /></span>
    <component :is="`h${headingLevel}`" class="q-empty__title"
      ><slot name="title">{{ title }}</slot></component
    >
    <div v-if="slots.default" class="q-empty__text"><slot /></div>
    <div v-if="slots.actions" class="q-empty__actions"><slot name="actions" /></div>
  </div>
</template>
