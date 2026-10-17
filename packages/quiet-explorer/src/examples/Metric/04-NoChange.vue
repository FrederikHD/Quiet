<!-- No movement shows without an arrow, in muted ink. -->
<script setup lang="ts">
import { QCard, QMetric } from 'quiet';
</script>

<template>
  <QCard class="kpi">
    <QMetric label="Conversion rate" value="2,4 %" :change="{ direction: 'same', value: '0 %', label: 'on yesterday' }" />
  </QCard>
</template>

<style scoped>
.kpi { max-width: 280px; }
</style>
