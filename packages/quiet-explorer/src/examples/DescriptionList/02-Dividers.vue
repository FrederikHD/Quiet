<!-- dividers draws a rule between items, for longer lists in a Card. -->
<script setup lang="ts">
import { QCard, QDescriptionList } from 'quiet';
</script>

<template>
  <QCard title="Product details" :heading-level="3">
    <QDescriptionList
      dividers
      :items="[
        { term: 'SKU', description: 'LC-2040' },
        { term: 'Vendor', description: 'Leinenweberei Rhön' },
        { term: 'Material', description: '100% linen, washed' },
        { term: 'Care', description: 'Machine wash at 40 °C' },
      ]"
    />
  </QCard>
</template>
