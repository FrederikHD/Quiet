<!-- The shop's search: collections and products as you type, and "Search for “…”" always last. Try "linen" or "navy". -->
<script setup lang="ts">
import { QSearchBox, money, type SearchSuggestionGroup } from '@frederikhd/quiet';
import { computed, ref } from 'vue';
import { photo } from '../../fixtures/pictures';

const PRODUCTS = [
  { name: 'Linen shirt', colour: 'Navy', type: 'Shirts', price: 59 },
  { name: 'Linen trousers', colour: 'Sand', type: 'Trousers', price: 79 },
  { name: 'Linen dress', colour: 'Natural', type: 'Dresses', price: 99 },
  { name: 'Linen overshirt', colour: 'Olive', type: 'Shirts', price: 89 },
  { name: 'Cotton tee', colour: 'Rust', type: 'T-shirts', price: 29 },
];
const COLLECTIONS = ['Shirts', 'Trousers', 'Dresses', 'T-shirts'];

const q = ref('');
const chose = ref('');
// Your search API goes here; this one filters a few products as you type.
const suggestions = computed<SearchSuggestionGroup[]>(() => {
  const t = q.value.trim().toLowerCase();
  if (!t) return [];
  const cols = COLLECTIONS.filter((c) => c.toLowerCase().includes(t));
  const prods = PRODUCTS.filter((p) => `${p.name} ${p.colour} ${p.type}`.toLowerCase().includes(t));
  return [
    { label: 'Collections', items: cols.map((c) => ({ label: c, icon: 'grid' as const })) },
    {
      label: 'Products',
      items: prods.map((p) => ({
        label: `${p.name}, ${p.colour.toLowerCase()}`,
        description: p.type,
        image: { src: photo(p.colour) },
        meta: money(p.price),
      })),
    },
  ].filter((g) => g.items.length);
});
</script>

<template>
  <div class="stack">
    <QSearchBox
      v-model="q"
      label="Search the shop"
      placeholder="Search shirts, linen, colours…"
      :suggestions="suggestions"
      @select="(item) => (chose = `Opened ${item.label}`)"
      @submit="(query) => (chose = `Searched for “${query}”`)"
    />
    <p class="log" role="status">{{ chose }}</p>
  </div>
</template>

<style scoped>
.stack {
  display: grid;
  gap: var(--space-3);
  max-width: 460px;
}
.log {
  margin: 0;
  min-height: 18px;
  font: var(--text-small);
  color: var(--ink-muted);
}
</style>
