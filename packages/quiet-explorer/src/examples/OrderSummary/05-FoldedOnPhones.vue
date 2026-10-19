<!-- Folded into one row with the total, so the form comes first on a phone. collapsible="auto" folds it under 900px; true always does. -->
<script setup lang="ts">
import { QOrderSummary } from '@frederikhd/quiet';
import { photo } from '../../fixtures/pictures';
</script>

<template>
  <div class="panel">
    <QOrderSummary
      collapsible
      :items="[{ name: 'Linen shirt', variant: 'Blue · M', quantity: 2, price: 118, image: { src: photo('Blue') } }]"
      :totals="[{ label: 'Shipping', amount: null, note: 'Chosen in the next step' }]"
      :total="118"
      tax-note="Including 18,84 € VAT (19 %)"
    />
  </div>
</template>

<style scoped>
.panel { max-width: 420px; padding: 0 var(--space-4); border-radius: var(--radius-md); background: var(--surface-sunken); }
</style>
