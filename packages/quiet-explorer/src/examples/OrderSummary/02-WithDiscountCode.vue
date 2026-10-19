<!-- A DiscountCode goes in the default slot, between the lines and the totals. Try LINEN10. -->
<script setup lang="ts">
import { QDiscountCode, QOrderSummary, money } from '@frederikhd/quiet';
import { computed, ref } from 'vue';
import { photo } from '../../fixtures/pictures';

const codes = ref<string[]>([]);
const discount = computed(() => (codes.value.length ? 5.9 : 0));
const total = computed(() => 59 - discount.value + 4.9);
function apply(code: string) {
  if (code.toUpperCase() !== 'LINEN10') return `“${code}” isn’t a valid code`;
  codes.value = ['LINEN10'];
}
</script>

<template>
  <div class="panel">
    <QOrderSummary
      :items="[{ name: 'Linen shirt', variant: 'Blue · M', price: 59, image: { src: photo('Blue') } }]"
      :totals="[
        discount ? { label: 'Discount', detail: 'LINEN10', amount: -discount } : null,
        { label: 'Shipping', detail: 'Standard', amount: 4.9 },
      ]"
      :total="total"
      :tax-note="`Including ${money(total - total / 1.19)} VAT (19 %)`"
    >
      <QDiscountCode :applied="codes.map((code) => ({ code, label: '−10 %' }))" :apply="apply" @remove="codes = []" />
    </QOrderSummary>
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
