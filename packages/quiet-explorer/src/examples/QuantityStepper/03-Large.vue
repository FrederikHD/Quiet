<!-- size="large" (48px) sits next to the Add to cart button on the product page. -->
<script setup lang="ts">
import { QButton, QQuantityStepper } from '@frederikhd/quiet';
import { ref } from 'vue';

const quantity = ref(1);
</script>

<template>
  <div class="buy">
    <QQuantityStepper v-model="quantity" size="large" aria-label="Quantity" />
    <QButton variant="primary" size="large">Add to cart</QButton>
  </div>
</template>

<style scoped>
.buy { display: flex; flex-wrap: wrap; gap: var(--space-3); }
</style>
