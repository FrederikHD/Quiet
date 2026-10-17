<script setup lang="ts">
import { computed } from 'vue';
import { useStrings } from '../../config';
import QLead from '../../internal/QLead.vue';
import QIcon from '../Icon/QIcon.vue';

export interface BreadcrumbItem {
  /** The page's name. */
  label: string;
  /** Its URL. Leave it out on the last item, the current page. */
  href?: string;
}
export interface BreadcrumbsProps {
  /** From the top down; the current page last, without href. */
  items: (BreadcrumbItem | null | false)[];
  /** The landmark's name. Default "Breadcrumb"; an aria-label on QBreadcrumbs wins. */
  strings?: { label?: string };
}

const props = withDefaults(defineProps<BreadcrumbsProps>(), { strings: undefined });
const emit = defineEmits<{ /** A crumb was clicked (for client-side routing). */ navigate: [item: BreadcrumbItem, event: MouseEvent] }>();

const strings = useStrings('breadcrumbs', { label: 'Breadcrumb' }, () => props.strings);
const items = computed(() => props.items.filter((x): x is BreadcrumbItem => !!x));
const last = computed(() => items.value.length - 1);
// Narrow (under 480px of its own width) only the parent shows, as "← Shirts".
const parentIndex = computed(() => (items.value[last.value]?.href == null ? last.value - 1 : last.value));
</script>

<template>
  <nav class="q-crumbs" :aria-label="strings.label">
    <ol class="q-crumbs__list">
      <li
        v-for="(it, i) in items"
        :key="i"
        :class="['q-crumbs__item', i === last && it.href == null && 'is-current', i === parentIndex && 'is-parent']"
      >
        <QIcon v-if="i > 0" name="chevron-right" size="sm" class="q-crumbs__sep" />
        <span v-if="i === last && it.href == null" class="q-crumbs__current" aria-current="page">{{ it.label }}</span>
        <a v-else class="q-crumbs__link" :href="it.href" @click="emit('navigate', it, $event)">
          <span v-if="i === parentIndex" class="q-crumbs__back"><QLead icon="arrow-left" /></span>
          <span class="q-crumbs__text">{{ it.label }}</span>
        </a>
      </li>
    </ol>
  </nav>
</template>
