<!-- Slim inputs in a compact back-office toolbar above a product list. -->
<script setup lang="ts">
import { QIcon, QInput } from 'quiet';
import { reactive } from 'vue';

const filters = reactive({ query: '', minStock: '10' });
</script>

<template>
  <div class="bar" data-density="compact">
    <QInput v-model="filters.query" class="query" size="slim" aria-label="Filter products" placeholder="Filter" clearable>
      <template #prefix><QIcon name="search" /></template>
    </QInput>
    <QInput v-model="filters.minStock" class="stock" size="slim" aria-label="Minimum stock" suffix="pcs" numeric align="end" inputmode="numeric" />
  </div>
</template>

<style scoped>
.bar { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.query { flex: 1 1 200px; max-width: 320px; }
.stock { flex: 0 1 120px; }
</style>
