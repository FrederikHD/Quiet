<!-- Before the shipping method is chosen, a row without an amount shows a note; 0 would read "Free". -->
<script setup lang="ts">
import { QOrderSummary } from 'quiet';
import { photo } from '../../fixtures/pictures';
</script>

<template>
  <div class="panel">
    <QOrderSummary
      :items="[{ name: 'Linen napkins (4)', variant: 'Natural', price: 24, image: { src: photo('Natural', 2) } }]"
      :totals="[{ label: 'Shipping', amount: null, note: 'Chosen in the next step' }]"
      :total="24"
      tax-note="Including 3,83 € VAT (19 %)"
    />
  </div>
</template>

<style scoped>
.panel { max-width: 420px; padding: var(--space-6); border-radius: var(--radius-md); background: var(--surface-sunken); }
</style>
