<script setup lang="ts">
import { computed } from 'vue';

export interface DescriptionListItem {
  /** The label: "SKU", "Subtotal". Use the `term-<key>` slot for rich content. */
  term: string;
  /** Empty shows "—". Use the `description-<key>` slot for rich content. */
  description?: string | number | null;
  /** Tabular figures. */
  numeric?: boolean;
  /** The summing item (total): a rule above, semibold. */
  emphasis?: boolean;
  /** Stable key, also the slot suffix (#description-<key>). Default: the item's index. */
  key?: string;
}
export interface DescriptionListProps {
  /** The pairs: { term, description, numeric, emphasis, key }. Falsy entries are skipped, so an item can be added conditionally. */
  items: (DescriptionListItem | null | false)[];
  /** columns (default): term beside value from 480px; inline: value right-aligned on the same line (totals); stacked: term above value. */
  layout?: 'columns' | 'inline' | 'stacked';
  /** Rules between items. */
  dividers?: boolean;
  /** columns layout: width of the term column. Default 12rem. */
  termWidth?: string;
  /** Default "—". */
  emptyText?: string;
}

const props = withDefaults(defineProps<DescriptionListProps>(), { layout: 'columns', termWidth: undefined, emptyText: '—' });
defineSlots<{
  /** Rich content for any item: `#term-<key>` / `#description-<key>` (key or index). */
  [name: string]: ((props: { item: DescriptionListItem }) => unknown) | undefined;
}>();

const items = computed(() => props.items.filter((x): x is DescriptionListItem => !!x));
const keyOf = (it: DescriptionListItem, i: number) => it.key ?? String(i);
const isEmpty = (it: DescriptionListItem) => it.description == null || it.description === '';
</script>

<template>
  <dl
    :class="['q-dl', `q-dl--${layout}`, dividers && 'q-dl--dividers']"
    :style="termWidth ? { '--q-dl-term': termWidth } : undefined"
  >
    <div v-for="(it, i) in items" :key="keyOf(it, i)" :class="['q-dl__item', it.emphasis && 'q-dl__item--emphasis']">
      <dt class="q-dl__term"><slot :name="`term-${keyOf(it, i)}`" :item="it">{{ it.term }}</slot></dt>
      <dd :class="['q-dl__desc', it.numeric && 'is-numeric']">
        <slot :name="`description-${keyOf(it, i)}`" :item="it">
          <span v-if="isEmpty(it)" class="q-dl__empty">{{ emptyText }}</span>
          <template v-else>{{ it.description }}</template>
        </slot>
      </dd>
    </div>
  </dl>
</template>
