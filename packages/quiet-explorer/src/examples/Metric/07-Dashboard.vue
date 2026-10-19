<!-- The back office's home page: a grid of Cards, each at least 200px wide. -->
<script setup lang="ts">
import { QCard, QMetric, money } from '@frederikhd/quiet';
</script>

<template>
  <div class="grid">
    <QCard
      ><QMetric label="Sales" :value="money(4280)" :change="{ direction: 'up', value: '12 %', label: 'on yesterday' }"
    /></QCard>
    <QCard
      ><QMetric label="Orders" value="38" :change="{ direction: 'down', value: 3, label: 'on yesterday' }"
    /></QCard>
    <QCard
      ><QMetric
        label="Returns"
        value="4"
        good-when="down"
        :change="{ direction: 'down', value: 2, label: 'on last week' }"
    /></QCard>
    <QCard
      ><QMetric label="To fulfil" value="9"><a href="#orders">View orders</a></QMetric></QCard
    >
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr));
  gap: var(--space-4);
}
</style>
