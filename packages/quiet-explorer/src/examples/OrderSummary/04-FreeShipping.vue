<!-- A shipping amount of 0 reads "Free". -->
<script setup lang="ts">
import { QOrderSummary } from 'quiet';
import { photo } from '../../fixtures/pictures';
</script>

<template>
  <div class="panel">
    <QOrderSummary
      :items="[{ name: 'Linen bed sheet', variant: 'Sage · 160 × 200', price: 89, image: { src: photo('Sage', 2) } }]"
      :totals="[{ label: 'Shipping', detail: 'Standard', amount: 0 }]"
      :total="89"
      tax-note="Including 14,21 € VAT (19 %)"
    />
  </div>
</template>

<style scoped>
.panel { max-width: 420px; padding: var(--space-6); border-radius: var(--radius-md); background: var(--surface-sunken); }
</style>
