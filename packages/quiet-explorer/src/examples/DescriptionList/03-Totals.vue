<!-- The inline layout pushes the value to the right, for totals; the emphasis item gets a rule above and semibold type. -->
<script setup lang="ts">
import { QCard, QDescriptionList } from '@frederikhd/quiet';
</script>

<template>
  <QCard title="Payment" :heading-level="3" class="narrow">
    <QDescriptionList
      layout="inline"
      :items="[
        { term: 'Subtotal', description: '118,00 €', numeric: true },
        { term: 'Shipping (Standard)', description: 'Free' },
        { term: 'Included VAT (19 %)', description: '18,84 €', numeric: true },
        { term: 'Total', description: '118,00 €', numeric: true, emphasis: true },
      ]"
    />
  </QCard>
</template>

<style scoped>
.narrow { max-width: 360px; }
</style>
