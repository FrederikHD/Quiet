<!-- Beside the checkout form on surface-sunken: the lines, a discount and shipping, then the total with VAT. -->
<script setup lang="ts">
import { QOrderSummary, type OrderSummaryItem } from '@frederikhd/quiet';
import { photo } from '../../fixtures/pictures';

const items: OrderSummaryItem[] = [
  { id: 'shirt', name: 'Linen shirt', variant: 'Blue · M', quantity: 2, price: 118, image: { src: photo('Blue') } },
  {
    id: 'trousers',
    name: 'Linen trousers',
    variant: 'Navy · 32',
    quantity: 1,
    price: 79,
    compareAt: 99,
    image: { src: photo('Navy', 2) },
  },
];
</script>

<template>
  <div class="panel">
    <QOrderSummary
      :items="items"
      :totals="[
        { label: 'Discount', detail: 'LINEN10', amount: -19.7 },
        { label: 'Shipping', detail: 'Standard', amount: 4.9 },
      ]"
      :total="182.2"
      tax-note="Including 29,09 € VAT (19 %)"
    />
  </div>
</template>

<style scoped>
.panel {
  max-width: 420px;
  padding: var(--space-6);
  border-radius: var(--radius-md);
  background: var(--surface-sunken);
}
</style>
