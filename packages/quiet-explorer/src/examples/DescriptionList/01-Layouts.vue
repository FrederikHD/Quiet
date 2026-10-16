<script setup lang="ts">
import { QCard, QDescriptionList } from 'quiet';
</script>

<template>
  <div class="pv">
    <QCard title="Product details">
      <QDescriptionList
        dividers
        :items="[
          { term: 'SKU', description: 'LC-2040' },
          { term: 'Vendor', description: 'Leinenweberei Rhön' },
          { term: 'Material', description: '100% linen, washed' },
          { term: 'Barcode', description: '' },
          { term: 'Weight', description: '0,35 kg', numeric: true },
        ]"
      />
    </QCard>
    <QCard title="Payment">
      <QDescriptionList
        layout="inline"
        :items="[
          { term: 'Subtotal', description: '118,00 €', numeric: true },
          { term: 'Shipping (Standard)', description: 'Free' },
          { term: 'Included VAT (19%)', description: '18,84 €', numeric: true },
          { term: 'Total', description: '118,00 €', numeric: true, emphasis: true },
        ]"
      />
    </QCard>
    <QCard title="Customer">
      <QDescriptionList
        layout="stacked"
        :items="[
          { term: 'Name', description: 'Anna Schmidt' },
          { term: 'Email', description: 'anna.schmidt@example.com' },
          { term: 'Customer since', description: 'March 2024 · 6 orders' },
        ]"
      />
    </QCard>
  </div>
</template>

<style scoped>
.pv { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr)); gap: var(--space-4); align-items: start; }
</style>
