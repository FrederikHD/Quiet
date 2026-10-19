<!-- Segmented and slim, for switching how something is shown: the period of a sales figure. -->
<script setup lang="ts">
import { QMetric, QTabs } from '@frederikhd/quiet';
import { ref } from 'vue';

const period = ref('7');
const sales: Record<string, string> = { '1': '1.240,00 €', '7': '8.905,50 €', '30': '36.210,90 €' };
</script>

<template>
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
    <QMetric label="Sales" :value="sales[period]" />
  </QTabs>
</template>
