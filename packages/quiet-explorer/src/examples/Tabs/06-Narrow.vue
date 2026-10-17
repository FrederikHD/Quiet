<!-- When the tabs don't fit, the row scrolls sideways and the cut-off edge fades; labels never wrap or truncate. -->
<script setup lang="ts">
import { QTabs } from 'quiet';
</script>

<template>
  <QTabs
    label="Product"
    class="narrow"
    :tabs="[
      { value: 'details', label: 'Details' },
      { value: 'pricing', label: 'Pricing' },
      { value: 'inventory', label: 'Inventory' },
      { value: 'shipping', label: 'Shipping' },
      { value: 'variants', label: 'Variants', count: 12, countLabel: '12 variants' },
    ]"
  >
    <template #panel-details><p>Title, description, images.</p></template>
    <template #panel-pricing><p>Price and compare-at price.</p></template>
    <template #panel-inventory><p>SKU and quantities.</p></template>
    <template #panel-shipping><p>Weight and customs.</p></template>
    <template #panel-variants><p>12 variants in 4 sizes and 3 colours.</p></template>
  </QTabs>
</template>

<style scoped>
.narrow { max-width: 300px; }
p { margin: 0; }
</style>
