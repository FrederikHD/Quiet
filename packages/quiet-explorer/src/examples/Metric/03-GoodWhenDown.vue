<!-- For returns, refunds and cancellations fewer is better: good-when="down" shows the fall in green. -->
<script setup lang="ts">
import { QCard, QMetric } from '@frederikhd/quiet';
</script>

<template>
  <QCard class="kpi">
    <QMetric
      label="Returns"
      value="4"
      good-when="down"
      :change="{ direction: 'down', value: 2, label: 'on last week' }"
    />
  </QCard>
</template>

<style scoped>
.kpi {
  max-width: 280px;
}
</style>
