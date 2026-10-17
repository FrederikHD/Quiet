<!-- The #empty slot says why there are no rows and what to do about it. -->
<script setup lang="ts">
import { QTable } from 'quiet';
</script>

<template>
  <QTable
    caption="Refunds"
    :rows="[]"
    :columns="[
      { key: 'id', header: 'Refund' },
      { key: 'order', header: 'Order' },
      { key: 'amount', header: 'Amount', numeric: true },
    ]"
  >
    <template #empty>No refunds yet. Refunds you issue from an order show up here.</template>
  </QTable>
</template>
