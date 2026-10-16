<script setup lang="ts">
import { QBadge, type BadgeTone } from 'quiet';

// One mapping for orders, payments, fulfilment and stock.
const rows: [BadgeTone, string[]][] = [
  ['success', ['Paid', 'Fulfilled', 'Delivered', 'In stock']],
  ['warning', ['Pending', 'Unfulfilled', 'Low stock', 'Partially refunded']],
  ['info', ['Processing', 'Shipped', 'In transit', 'Pre-order']],
  ['danger', ['Payment failed', 'Cancelled', 'Out of stock']],
  ['neutral', ['Draft', 'Archived', 'Refunded']],
  ['sale', ['Sale', '−30%']],
];
</script>

<template>
  <div class="pv">
    <div v-for="[tone, words] in rows" :key="tone" class="row">
      <span class="tone">{{ tone }}</span>
      <QBadge v-for="w in words" :key="w" :tone="tone" :icon="w === 'Shipped' ? 'truck' : undefined">{{ w }}</QBadge>
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-4); }
.row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); }
.tone { width: 72px; font: var(--text-caption); color: var(--ink-muted); }
</style>
