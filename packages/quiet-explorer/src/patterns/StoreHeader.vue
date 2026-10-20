<!-- The store's own header around Quiet's SearchBox and Button, shared by the storefront patterns. -->
<script setup lang="ts">
import { QButton, QSearchBox, toast } from '@frederikhd/quiet';
import { computed, ref } from 'vue';
import { photo } from '../fixtures/pictures';

defineProps<{ cartCount: number; cartOpen?: boolean }>();
const emit = defineEmits<{ 'open-cart': [] }>();

const colours = ['Navy', 'Sand', 'Olive', 'Rust'];
const query = ref('');
const suggestions = computed(() =>
  query.value.trim()
    ? ['Linen shirt', 'Linen trousers', 'Linen shorts', 'Linen dress']
        .filter((s) => s.toLowerCase().includes(query.value.trim().toLowerCase()))
        .map((label, i) => ({ id: i, label, image: { src: photo(colours[i % colours.length]) } }))
    : [],
);
</script>

<template>
  <header class="store__header">
    <a class="store__brand" href="#store">Leinen &amp; Co</a>
    <nav class="store__nav" aria-label="Shop">
      <a href="#women">Women</a>
      <a href="#men" aria-current="page">Men</a>
      <a href="#home">Home</a>
    </nav>
    <QSearchBox
      v-model="query"
      class="store__search"
      label="Search the shop"
      placeholder="Search"
      :suggestions="suggestions"
      @submit="(q) => toast(`Search for “${q}”`)"
      @select="(item) => toast(`Open ${item.label}`)"
    />
    <QButton
      variant="ghost"
      icon-start="cart"
      aria-label="Cart"
      :count="cartCount"
      :count-label="(n) => (n === 1 ? '1 item' : `${n} items`)"
      :expanded="cartOpen"
      @click="emit('open-cart')"
    />
  </header>
</template>

<style scoped>
.store__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2) var(--space-6);
  padding: var(--space-3) var(--space-6);
  border-bottom: 1px solid var(--line);
}
.store__brand {
  color: var(--ink);
  font: var(--text-title);
  text-decoration: none;
}
.store__nav {
  display: flex;
  gap: var(--space-4);
}
.store__nav a {
  color: var(--ink-muted);
  text-decoration: none;
}
.store__nav a[aria-current='page'] {
  color: var(--ink);
  font-weight: 600;
}
.store__search {
  flex: 1 1 200px;
  max-width: 360px;
  margin-inline-start: auto;
}
</style>
