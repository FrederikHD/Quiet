<!-- mobile="cards": under 640px of table width each row becomes a card, with Select all and a Sort by menu above. -->
<script setup lang="ts">
import { QBadge, QTable, money, type BadgeTone } from '@frederikhd/quiet';

const orders = [
  { id: 10500, customer: 'Anna Schmidt', status: 'Unfulfilled', items: 2, total: 118 },
  { id: 10499, customer: 'Jonas Weber', status: 'Shipped', items: 1, total: 59 },
  { id: 10498, customer: 'Lea Fischer', status: 'Fulfilled', items: 3, total: 142.9 },
];
const tone: Record<string, BadgeTone> = { Unfulfilled: 'warning', Shipped: 'info', Fulfilled: 'success' };
</script>

<template>
  <div class="phone">
    <QTable
      caption="Orders"
      mobile="cards"
      selectable
      :row-label="(o) => `order #${o.id}`"
      :rows="orders"
      :columns="[
        { key: 'id', header: 'Order', sortable: true, format: (o) => `#${o.id}` },
        { key: 'customer', header: 'Customer', sortable: true },
        { key: 'status', header: 'Fulfilment' },
        { key: 'items', header: 'Items', numeric: true, mobile: false },
        {
          key: 'total',
          header: 'Total',
          numeric: true,
          sortable: true,
          sortLabels: ['Lowest total first', 'Highest total first'],
          format: (o) => money(o.total),
        },
      ]"
    >
      <template #cell-status="{ row }"
        ><QBadge :tone="tone[row.status]">{{ row.status }}</QBadge></template
      >
    </QTable>
  </div>
</template>

<style scoped>
/* A phone-sized column, so the cards show at any screen width. */
.phone {
  max-width: 375px;
}
</style>
