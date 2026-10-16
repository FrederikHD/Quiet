<script setup lang="ts">
import { QIcon, QInput } from 'quiet';
import { reactive } from 'vue';

const v = reactive({
  name: '', search: '#1049', price: '49,90', filter: '', stock: '10',
  email: 'anna@example', order: 'ORD-2026-01049', weight: '1,2', shop: '',
});
</script>

<template>
  <div class="pv">
    <div v-for="d in ['comfortable', 'compact']" :key="d" class="row" :data-density="d">
      <span class="label">{{ d }}</span>
      <QInput v-model="v.name" class="w" aria-label="Product name" placeholder="e.g. Linen shirt" />
      <QInput v-model="v.search" class="w" aria-label="Search orders" placeholder="Search orders" clearable>
        <template #prefix><QIcon name="search" /></template>
      </QInput>
      <QInput v-model="v.price" class="s" aria-label="Price in EUR" suffix="€" align="end" numeric inputmode="decimal" />
    </div>
    <div class="row" data-density="compact">
      <span class="label">Slim filter</span>
      <QInput v-model="v.filter" class="w" aria-label="Filter products" placeholder="Filter" size="slim" clearable>
        <template #prefix><QIcon name="search" /></template>
      </QInput>
      <QInput v-model="v.stock" class="s" aria-label="Minimum stock" size="slim" suffix="pcs" align="end" numeric inputmode="numeric" />
    </div>
    <div class="row">
      <span class="label">States</span>
      <QInput v-model="v.email" class="w" aria-label="Email" invalid />
      <QInput v-model="v.order" class="w" aria-label="Order number" readonly numeric />
      <QInput v-model="v.weight" class="s" aria-label="Weight in kg" disabled suffix="kg" />
    </div>
    <div class="row">
      <span class="label">Large</span>
      <QInput v-model="v.shop" class="l" aria-label="Search the shop" placeholder="Search for products" size="large" clearable>
        <template #prefix><QIcon name="search" /></template>
      </QInput>
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-4); }
.row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3); }
.label { flex: 0 0 112px; font: var(--text-caption); color: var(--ink-muted); }
.w { width: 200px; max-width: 100%; }
.s { width: 120px; max-width: 100%; }
.l { width: 320px; max-width: 100%; }
</style>
