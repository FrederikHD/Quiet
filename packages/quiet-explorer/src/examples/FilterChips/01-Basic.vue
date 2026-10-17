<!-- The filters in use above the results; one tap removes one, and Clear all appears from two chips up. -->
<script setup lang="ts">
import { QFilterChips, type FilterChip } from 'quiet';
import { ref } from 'vue';
import { swatchOf } from '../../fixtures/pictures';

const filters = ref<FilterChip[]>([
  { key: 'colour:navy', label: 'Navy', swatch: swatchOf('Navy') },
  { key: 'colour:sand', label: 'Sand', swatch: swatchOf('Sand') },
  { key: 'size:m', label: 'Size M' },
  { key: 'price', label: '30 € – 90 €' },
  { key: 'stock', label: 'In stock' },
]);
</script>

<template>
  <div class="results">
    <QFilterChips :items="filters" @remove="(key) => (filters = filters.filter((f) => f.key !== key))" @clear="filters = []" />
    <p class="count" role="status">{{ filters.length ? '' : 'No filters: showing all 48 linen shirts.' }}</p>
  </div>
</template>

<style scoped>
.results { display: grid; gap: var(--space-3); }
.count { margin: 0; min-height: 18px; font: var(--text-small); color: var(--ink-muted); }
</style>
