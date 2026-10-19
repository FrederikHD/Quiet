<!-- In the cart :min="0" lets people go to zero; removing the line is up to the app. -->
<script setup lang="ts">
import { QQuantityStepper } from '@frederikhd/quiet';
import { ref } from 'vue';

const quantity = ref(2);
</script>

<template>
  <div class="line">
    <span class="name">Linen shirt, navy</span>
    <QQuantityStepper v-model="quantity" aria-label="Quantity of Linen shirt, navy" :min="0" :max="5" />
    <span class="status" role="status">{{ quantity === 0 ? 'Removed from cart' : `${quantity} in cart` }}</span>
  </div>
</template>

<style scoped>
.line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}
.name {
  flex: 1 1 140px;
}
.status {
  flex-basis: 100%;
  font: var(--text-small);
  color: var(--ink-muted);
}
</style>
