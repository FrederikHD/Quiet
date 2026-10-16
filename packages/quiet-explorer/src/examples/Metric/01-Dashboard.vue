<script setup lang="ts">
import { QCard, QMetric, money } from 'quiet';
</script>

<template>
  <div class="pv">
    <QCard><QMetric label="Sales" :value="money(4280)" :change="{ direction: 'up', value: '12 %', label: 'on yesterday' }" /></QCard>
    <QCard><QMetric label="Orders" value="38" :change="{ direction: 'down', value: '3', label: 'on yesterday' }" /></QCard>
    <QCard><QMetric label="Returns" value="4" good-when="down" :change="{ direction: 'down', value: '2', label: 'on last week' }" /></QCard>
    <QCard><QMetric label="To fulfil" value="9"><a href="#orders">View orders</a></QMetric></QCard>
  </div>
</template>

<style scoped>
.pv { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr)); gap: var(--space-4); }
</style>
