<!-- The #title slot, when the heading needs more than text: a status badge beside it. -->
<script setup lang="ts">
import { QBadge, QCard, QDescriptionList } from '@frederikhd/quiet';
</script>

<template>
  <QCard class="card">
    <template #title>Payment <QBadge tone="success">Paid</QBadge></template>
    <QDescriptionList
      layout="inline"
      :items="[
        { term: 'Subtotal', description: '118,00 €', numeric: true },
        { term: 'Shipping', description: '4,90 €', numeric: true },
        { term: 'Total', description: '122,90 €', numeric: true, emphasis: true },
      ]"
    />
  </QCard>
</template>

<style scoped>
.card {
  max-width: 400px;
}
</style>
