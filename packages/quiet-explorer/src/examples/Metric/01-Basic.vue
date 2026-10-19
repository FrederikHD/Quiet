<!-- The figure, how it moved and what it's compared with. Up is good, so it shows in green with an arrow. -->
<script setup lang="ts">
import { QCard, QMetric, money } from '@frederikhd/quiet';
</script>

<template>
  <QCard class="kpi">
    <QMetric label="Sales" :value="money(4280)" :change="{ direction: 'up', value: '12 %', label: 'on yesterday' }" />
  </QCard>
</template>

<style scoped>
.kpi { max-width: 280px; }
</style>
