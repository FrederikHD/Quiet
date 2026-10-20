<!-- The store's own header around Quiet's SearchBox and Button, shared by the storefront patterns. On phones it is one row: menu, brand, search and cart; the search opens full screen. -->
<script setup lang="ts">
import { QButton, QDialog, QSearchBox, toast, type SearchSuggestion } from '@frederikhd/quiet';
import { computed, ref } from 'vue';
import { photo } from '../fixtures/pictures';

defineProps<{ cartCount: number; cartOpen?: boolean }>();
const emit = defineEmits<{ 'open-cart': [] }>();

const sections = [
  { href: '#women', label: 'Women' },
  { href: '#men', label: 'Men', current: true },
  { href: '#home', label: 'Home' },
];
const colours = ['Navy', 'Sand', 'Olive', 'Rust'];
const query = ref('');
const suggestions = computed<SearchSuggestion[]>(() =>
  query.value.trim()
    ? ['Linen shirt', 'Linen trousers', 'Linen shorts', 'Linen dress']
        .filter((s) => s.toLowerCase().includes(query.value.trim().toLowerCase()))
        .map((label, i) => ({ id: i, label, image: { src: photo(colours[i % colours.length]) } }))
    : [],
);
const popular = ['Linen shirt', 'Shorts', 'Bed linen', 'Gift card'];

// Phones: the menu and the search each open full screen, so neither has to fit in the header.
const menuOpen = ref(false);
const searchOpen = ref(false);
function search(q: string) {
  searchOpen.value = false;
  toast(`Search for “${q}”`);
}
function open(label: string) {
  searchOpen.value = false;
  toast(`Open ${label}`);
}
</script>

<template>
  <header class="store__header">
    <QButton
      class="store__phone"
      variant="ghost"
      icon-start="menu"
      aria-label="Menu"
      :expanded="menuOpen"
      @click="menuOpen = true"
    />
    <a class="store__brand" href="#store">Leinen &amp; Co</a>
    <nav class="store__nav" aria-label="Shop">
      <a v-for="s in sections" :key="s.href" :href="s.href" :aria-current="s.current ? 'page' : undefined">{{
        s.label
      }}</a>
    </nav>
    <QSearchBox
      v-model="query"
      class="store__search"
      label="Search the shop"
      placeholder="Search"
      :suggestions="suggestions"
      @submit="search"
      @select="(item) => open(item.label)"
    />
    <div class="store__icons">
      <QButton
        class="store__phone"
        variant="ghost"
        icon-start="search"
        aria-label="Search"
        :expanded="searchOpen"
        @click="searchOpen = true"
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
    </div>

    <QDialog v-model:open="menuOpen" placement="start" title="Menu">
      <nav aria-label="Shop">
        <ul class="store__menu">
          <li v-for="s in sections" :key="s.href">
            <a :href="s.href" :aria-current="s.current ? 'page' : undefined" @click="menuOpen = false">{{ s.label }}</a>
          </li>
        </ul>
      </nav>
    </QDialog>

    <QDialog v-model:open="searchOpen" title="Search" mobile="full">
      <QSearchBox
        v-model="query"
        inline
        size="large"
        label="Search the shop"
        :suggestions="suggestions"
        @submit="search"
        @select="(item) => open(item.label)"
      />
      <section v-if="!query.trim()" class="store__popular" aria-labelledby="store-popular">
        <h3 id="store-popular">Popular searches</h3>
        <ul>
          <li v-for="p in popular" :key="p">
            <QButton size="slim" icon-start="search" @click="search(p)">{{ p }}</QButton>
          </li>
        </ul>
      </section>
    </QDialog>
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
.store__icons {
  display: flex;
  gap: var(--space-1);
}
.store__phone {
  display: none;
}
/* Phones: one row of menu, brand, search and cart. */
@container (max-width: 639px) {
  .store__header {
    flex-wrap: nowrap;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
  }
  .store__nav,
  .store__search {
    display: none;
  }
  .store__phone {
    display: inline-flex;
  }
  .store__icons {
    margin-inline-start: auto;
  }
}
.store__menu {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}
.store__menu a {
  display: block;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  font: var(--text-heading);
  text-decoration: none;
}
.store__menu a[aria-current='page'] {
  font-weight: 600;
}
.store__popular {
  margin-top: var(--space-6);
}
.store__popular h3 {
  margin: 0 0 var(--space-3);
  color: var(--ink-muted);
  font: var(--text-small);
}
.store__popular ul {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
