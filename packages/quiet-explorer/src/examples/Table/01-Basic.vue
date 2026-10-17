<!-- A caption, columns and rows. Click a sortable header to sort, again to reverse; numbers sit right with tabular figures. -->
<script setup lang="ts">
import { QBadge, QTable, money, type BadgeTone } from 'quiet';

const orders = [
  { id: 10500, customer: 'Anna Schmidt', status: 'Unfulfilled', total: 118 },
  { id: 10499, customer: 'Jonas Weber', status: 'Shipped', total: 59 },
  { id: 10498, customer: 'Lea Fischer', status: 'Fulfilled', total: 142.9 },
  { id: 10497, customer: 'Paul Wagner', status: 'Fulfilled', total: 24 },
  { id: 10496, customer: 'Mia Becker', status: 'Shipped', total: 83.9 },
];
const tone: Record<string, BadgeTone> = { Unfulfilled: 'warning', Shipped: 'info', Fulfilled: 'success' };
</script>

<template>
  <QTable
    caption="Recent orders"
    :default-sort="{ key: 'id', direction: 'desc' }"
    :rows="orders"
    :columns="[
      { key: 'id', header: 'Order', sortable: true, sortFirst: 'desc', format: (o) => `#${o.id}` },
      { key: 'customer', header: 'Customer', sortable: true },
      { key: 'status', header: 'Fulfilment' },
      { key: 'total', header: 'Total', numeric: true, sortable: true, format: (o) => money(o.total) },
    ]"
  >
    <template #cell-status="{ row }"><QBadge :tone="tone[row.status]">{{ row.status }}</QBadge></template>
  </QTable>
</template>
