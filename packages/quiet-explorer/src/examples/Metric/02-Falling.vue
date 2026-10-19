<!-- A fall in something that should grow shows in red; the arrow and the words carry it too, never colour alone. -->
<script setup lang="ts">
import { QCard, QMetric } from '@frederikhd/quiet';
</script>

<template>
  <QCard class="kpi">
    <QMetric label="Orders" value="38" :change="{ direction: 'down', value: 3, label: 'on yesterday' }" />
  </QCard>
</template>

<style scoped>
.kpi {
  max-width: 280px;
}
</style>
