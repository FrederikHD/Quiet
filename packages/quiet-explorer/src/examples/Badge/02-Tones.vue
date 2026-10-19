<!-- One mapping from status to tone, used for orders, payments, fulfilment and stock everywhere. -->
<script setup lang="ts">
import { QBadge, type BadgeTone } from '@frederikhd/quiet';

const rows: [BadgeTone, string[]][] = [
  ['success', ['Paid', 'Fulfilled', 'In stock']],
  ['warning', ['Pending', 'Unfulfilled', 'Low stock']],
  ['info', ['Processing', 'Shipped', 'Pre-order']],
  ['danger', ['Payment failed', 'Cancelled', 'Out of stock']],
  ['neutral', ['Draft', 'Archived', 'Refunded']],
];
</script>

<template>
  <div class="rows">
    <div v-for="[tone, words] in rows" :key="tone" class="row">
      <QBadge v-for="w in words" :key="w" :tone="tone">{{ w }}</QBadge>
    </div>
  </div>
</template>

<style scoped>
.rows { display: grid; gap: var(--space-3); }
.row { display: flex; flex-wrap: wrap; gap: var(--space-2); }
</style>
