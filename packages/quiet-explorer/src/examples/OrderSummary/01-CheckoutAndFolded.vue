<script setup lang="ts">
import { QDiscountCode, QOrderSummary, money, type OrderSummaryItem } from 'quiet';
import { computed, ref } from 'vue';
import { photo } from '../../fixtures/pictures';

const items: OrderSummaryItem[] = [
  { id: 'a', name: 'Linen shirt', variant: 'Blue · M', quantity: 2, price: 118, image: { src: photo('Blue') } },
  { id: 'b', name: 'Linen trousers', variant: 'Navy · 32', quantity: 1, price: 79, compareAt: 99, image: { src: photo('Navy', 1) } },
  { id: 'c', name: 'Linen napkins (4)', variant: 'Charcoal', quantity: 1, price: 24, image: { src: photo('Natural', 2) } },
];
const codes = ref<string[]>(['LINEN10']);
const discount = computed(() => (codes.value.includes('LINEN10') ? 22.1 : 0));
const total = computed(() => 221 - discount.value + 4.9);
function apply(code: string) {
  if (code.toUpperCase() !== 'LINEN10') return `“${code}” isn’t a valid code`;
  codes.value = ['LINEN10'];
}
</script>

<template>
  <div class="pv">
    <div>
      <p class="pv-title">In checkout, with a discount code (try LINEN10)</p>
      <div class="panel">
        <QOrderSummary
          :items="items"
          :totals="[discount ? { label: 'Discount', detail: 'LINEN10', amount: -discount } : null, { label: 'Shipping', detail: 'Standard', amount: 4.9 }]"
          :total="total"
          :tax-note="`Including ${money(total - total / 1.19)} VAT (19 %)`"
        >
          <QDiscountCode
            :applied="codes.map((code) => ({ code, label: '−10 %' }))"
            :apply="apply"
            @remove="(c) => (codes = codes.filter((x) => x !== c))"
          />
        </QOrderSummary>
      </div>
    </div>
    <div>
      <p class="pv-title">Folded (phones): tap to open</p>
      <div class="panel panel--folded">
        <QOrderSummary
          collapsible
          :items="items.slice(0, 1)"
          :totals="[{ label: 'Shipping', amount: null, note: 'Chosen in the next step' }]"
          :total="118"
          tax-note="Including 18,84 € VAT (19 %)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-8); }
.pv-title { margin: 0 0 var(--space-3); font: var(--text-caption); color: var(--ink-muted); }
.panel { max-width: 420px; padding: var(--space-6); border-radius: var(--radius-md); background: var(--surface-sunken); }
.panel--folded { padding: 0 var(--space-4); }
.panel :deep(.q-summary__media) { background: var(--surface-raised); }
</style>
