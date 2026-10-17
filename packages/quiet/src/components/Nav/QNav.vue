<script setup lang="ts">
import { computed } from 'vue';
import { useStrings } from '../../config';
import { useQuietId } from '../../composables/useQuietId';
import QNavItem from './QNavItem.vue';
import type { NavItem, NavSection } from './types';

export interface NavProps {
  /** Sections of links, each with an optional title. */
  sections?: NavSection[];
  /** A single section. */
  items?: NavItem[];
  /** The nav landmark's name. Default "Main"; an aria-label on QNav wins. */
  strings?: { nav?: string };
}

const props = withDefaults(defineProps<NavProps>(), { sections: undefined, items: undefined, strings: undefined });
const emit = defineEmits<{ /** An item was clicked (for client-side routing; links still navigate unless you prevent it). */ navigate: [item: NavItem, event: MouseEvent] }>();

const strings = useStrings('shell', { nav: 'Main' }, () => props.strings);
const baseId = useQuietId('q-nav-');
const sections = computed<NavSection[]>(() => props.sections ?? [{ items: props.items ?? [] }]);
</script>

<template>
  <nav class="q-nav" :aria-label="strings.nav">
    <div
      v-for="(s, si) in sections"
      :key="si"
      class="q-nav__section"
      :role="s.title ? 'group' : undefined"
      :aria-labelledby="s.title ? `${baseId}-s${si}` : undefined"
    >
      <div v-if="s.title" :id="`${baseId}-s${si}`" class="q-nav__title">{{ s.title }}</div>
      <ul class="q-nav__list">
        <QNavItem v-for="(it, i) in s.items" :key="it.key ?? it.href ?? i" :item="it" :depth="0" @navigate="(item, e) => emit('navigate', item, e)" />
      </ul>
    </div>
  </nav>
</template>
