<script setup lang="ts">
import { QSearchBox, money, type SearchSuggestionGroup } from 'quiet';
import { computed, ref } from 'vue';

function thumb(hue: number) {
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 50"><rect width="40" height="50" fill="hsl(${hue} 20% 88%)"/><path d="M14 14l6 3 6-3 6 5-3 4-2-1v16H13V22l-2 1-3-4z" fill="hsl(${hue} 30% 55%)"/></svg>`)}`;
}
const PRODUCTS = [
  { name: 'Linen shirt', type: 'Shirts', price: 59, hue: 210, words: 'navy blue sand' },
  { name: 'Linen trousers', type: 'Trousers', price: 79, hue: 222, words: 'navy rust' },
  { name: 'Linen dress', type: 'Dresses', price: 99, hue: 45, words: 'natural sand' },
  { name: 'Linen overshirt', type: 'Shirts', price: 89, hue: 78, words: 'olive navy' },
  { name: 'Cotton tee', type: 'T-shirts', price: 29, hue: 16, words: 'rust sage' },
  { name: 'Linen napkins (4)', type: 'Home', price: 24, hue: 0, words: 'charcoal natural' },
];
const COLLECTIONS = ['Shirts', 'Trousers', 'Dresses', 'T-shirts', 'Home'];

const q = ref('');
const log = ref('');
// Your search API goes here; this one filters a few products as you type.
const suggestions = computed<SearchSuggestionGroup[]>(() => {
  const t = q.value.trim().toLowerCase();
  if (!t) return [];
  const cols = COLLECTIONS.filter((c) => c.toLowerCase().includes(t));
  const prods = PRODUCTS.filter((p) => `${p.name} ${p.type} ${p.words}`.toLowerCase().includes(t)).slice(0, 5);
  return [
    ...(cols.length ? [{ label: 'Collections', items: cols.map((c) => ({ id: c, label: c, icon: 'grid' as const })) }] : []),
    ...(prods.length
      ? [{ label: 'Products', items: prods.map((p) => ({ id: p.name, label: p.name, description: p.type, image: thumb(p.hue), meta: money(p.price) })) }]
      : []),
  ];
});
</script>

<template>
  <div class="pv">
    <QSearchBox
      v-model="q"
      :suggestions="suggestions"
      placeholder="Search shirts, linen, colours…"
      @select="(it) => (log = `Opened ${it.label}`)"
      @submit="(v) => (log = `Searched for “${v}”`)"
    />
    <p class="log" role="status">{{ log }}</p>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-4); max-width: 460px; }
.log { margin: 0; min-height: 18px; font: var(--text-small); color: var(--ink-muted); }
</style>
