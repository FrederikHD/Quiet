<!-- size="small" for side columns and dense dashboards. -->
<script setup lang="ts">
import { QCard, QMetric, money } from '@frederikhd/quiet';
</script>

<template>
  <QCard class="kpi" title="This customer" :heading-level="3">
    <div class="pair">
      <QMetric size="small" label="Orders" value="6" />
      <QMetric size="small" label="Spent" :value="money(486.4)" />
    </div>
  </QCard>
</template>

<style scoped>
.kpi { max-width: 280px; }
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
</style>
