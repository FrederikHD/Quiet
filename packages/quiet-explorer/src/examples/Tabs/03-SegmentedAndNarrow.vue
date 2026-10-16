<script setup lang="ts">
import { QTabs } from 'quiet';
import { ref } from 'vue';

const period = ref('7');
const sales: Record<string, string> = { '1': '1.240,00 €', '7': '8.905,50 €', '30': '36.210,90 €' };
</script>

<template>
  <div class="pv">
    <div class="box">
      <p class="pv-title">segmented, slim — switching a view</p>
      <QTabs
        v-model="period"
        label="Period"
        variant="segmented"
        size="slim"
        :tabs="[
          { value: '1', label: 'Today' },
          { value: '7', label: '7 days' },
          { value: '30', label: '30 days' },
        ]"
      >
        <div class="pv-title">Sales</div>
        <div class="metric">{{ sales[period] }}</div>
      </QTabs>
    </div>
    <div class="narrow">
      <p class="pv-title">Narrow — the row scrolls, the edge fades</p>
      <QTabs
        label="Product"
        :tabs="[
          { value: 'd', label: 'Details' },
          { value: 'p', label: 'Pricing' },
          { value: 'i', label: 'Inventory' },
          { value: 's', label: 'Shipping' },
          { value: 'v', label: 'Variants', count: 12 },
        ]"
      >
        <template #panel-d><p>Title, description, images.</p></template>
        <template #panel-p><p>Price and compare-at price.</p></template>
        <template #panel-i><p>SKU and quantities.</p></template>
        <template #panel-s><p>Weight and customs.</p></template>
        <template #panel-v><p>12 variants.</p></template>
      </QTabs>
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-8); }
.pv-title { margin: 0 0 var(--space-2); font: var(--text-small); color: var(--ink-muted); }
.box { max-width: 640px; }
.narrow { max-width: 320px; }
.metric { font: var(--text-metric); font-variant-numeric: tabular-nums; }
p { margin: 0; }
</style>
