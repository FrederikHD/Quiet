<!-- Without a title the card is just a surface: here, one figure on a dashboard. -->
<script setup lang="ts">
import { QCard, QMetric } from '@frederikhd/quiet';
</script>

<template>
  <QCard class="card">
    <QMetric
      label="Sales today"
      value="4.210,00 €"
      :change="{ direction: 'up', value: '12 %', label: 'on yesterday' }"
    />
  </QCard>
</template>

<style scoped>
.card {
  max-width: 280px;
}
</style>
