<!-- The #tax-note slot takes your own text, with a link to the shipping costs. -->
<script setup lang="ts">
import { QOrderSummary } from '@frederikhd/quiet';
import { photo } from '../../fixtures/pictures';
</script>

<template>
  <div class="panel">
    <QOrderSummary
      :items="[{ name: 'Linen apron', variant: 'Rust', price: 35, image: { src: photo('Rust', 2) } }]"
      :totals="[{ label: 'Shipping', detail: 'Standard', amount: 4.9 }]"
      :total="39.9"
    >
      <template #tax-note>Including 6,37 € VAT (19 %) · <a href="#shipping">Shipping costs</a></template>
    </QOrderSummary>
  </div>
</template>

<style scoped>
.panel { max-width: 420px; padding: var(--space-6); border-radius: var(--radius-md); background: var(--surface-sunken); }
</style>
