<!-- The default slot leads to the list behind the number. -->
<script setup lang="ts">
import { QCard, QMetric } from 'quiet';
</script>

<template>
  <QCard class="kpi">
    <QMetric label="To fulfil" value="9"><a href="#orders">View orders</a></QMetric>
  </QCard>
</template>

<style scoped>
.kpi { max-width: 280px; }
</style>
