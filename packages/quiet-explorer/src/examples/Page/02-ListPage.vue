<!-- A list page: a plain title, the main action last, and compact density for the table. -->
<script setup lang="ts">
import { QButton, QPage, QTable } from 'quiet';

const products = [
  { sku: 'LS-2040', title: 'Linen shirt, blue', stock: 30, price: '59,00 €' },
  { sku: 'LT-1180', title: 'Linen trousers, sand', stock: 12, price: '79,00 €' },
  { sku: 'LD-3020', title: 'Linen dress, natural', stock: 4, price: '99,00 €' },
];
</script>

<template>
  <div class="frame">
    <QPage title="Products" density="compact">
      <template #actions>
        <QButton icon-start="download">Export</QButton>
        <QButton variant="primary" icon-start="plus">Add product</QButton>
      </template>
      <QTable
        caption="Products"
        mobile="cards"
        :rows="products"
        row-key="sku"
        :columns="[
          { key: 'title', header: 'Product' },
          { key: 'sku', header: 'SKU' },
          { key: 'stock', header: 'Stock', numeric: true },
          { key: 'price', header: 'Price', numeric: true },
        ]"
      />
    </QPage>
  </div>
</template>

<style scoped>
.frame { border: 1px solid var(--line); border-radius: var(--radius-md); background: var(--surface); }
</style>
