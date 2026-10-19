<!-- selectable adds checkboxes; while rows are ticked, a bar shows the count, your bulk actions and Clear selection. -->
<script setup lang="ts">
import { QButton, QTable, money, type RowKey } from '@frederikhd/quiet';
import { ref } from 'vue';

const orders = [
  { id: 10500, customer: 'Anna Schmidt', total: 118 },
  { id: 10499, customer: 'Jonas Weber', total: 59 },
  { id: 10498, customer: 'Lea Fischer', total: 142.9 },
  { id: 10497, customer: 'Paul Wagner', total: 24 },
];
const selected = ref<RowKey[]>([10499]);
const log = ref('');
function fulfil() {
  log.value = `Marked ${selected.value.length} orders as fulfilled.`;
  selected.value = [];
}
</script>

<template>
  <QTable
    v-model:selected="selected"
    caption="Unfulfilled orders"
    selectable
    :row-label="(o) => `order #${o.id}`"
    :rows="orders"
    :columns="[
      { key: 'id', header: 'Order', format: (o) => `#${o.id}` },
      { key: 'customer', header: 'Customer' },
      { key: 'total', header: 'Total', numeric: true, format: (o) => money(o.total) },
    ]"
  >
    <template #bulk-actions>
      <QButton size="slim" @click="fulfil">Mark as fulfilled</QButton>
    </template>
  </QTable>
  <p class="log" role="status">{{ log }}</p>
</template>

<style scoped>
.log {
  margin: 0;
  min-height: 18px;
  font: var(--text-small);
  color: var(--ink-muted);
}
</style>
