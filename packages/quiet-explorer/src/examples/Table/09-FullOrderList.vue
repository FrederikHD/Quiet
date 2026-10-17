<!-- The full order list: search, a filter, sorting and paging done by the server, "Select all 128", bulk actions and invoices. Cards on phones. -->
<script setup lang="ts">
import { QBadge, QButton, QIcon, QInput, QPagination, QSelect, QTable, money, type BadgeTone, type RowKey, type TableSort } from 'quiet';
import { computed, ref } from 'vue';

// 128 orders, filtered, sorted and paged by the app (as a server would); the table shows one page.
const names = ['Anna Schmidt', 'Jonas Weber', 'Lea Fischer', 'Paul Wagner', 'Mia Becker', 'Felix Hoffmann', 'Emma Schulz', 'Noah Koch', 'Lina Richter', 'Ben Klein', 'Clara Wolf', 'Elias Neumann'];
const pay: [string, BadgeTone][] = [['Paid', 'success'], ['Pending', 'warning'], ['Refunded', 'neutral'], ['Failed', 'danger']];
const ful: [string, BadgeTone][] = [['Fulfilled', 'success'], ['Unfulfilled', 'warning'], ['Shipped', 'info']];
interface Order {
  id: number;
  customer: string;
  date: Date;
  total: number;
  items: number;
  payment: [string, BadgeTone];
  fulfilment: [string, BadgeTone];
}
const orders: Order[] = Array.from({ length: 128 }, (_, i) => {
  const date = new Date(2026, 9, 13, 18, 0);
  date.setHours(date.getHours() - i * 5);
  return {
    id: 10500 - i,
    customer: names[(i * 7) % names.length],
    date,
    total: Math.round((19.9 + ((i * 37) % 260) + ((i * 13) % 100) / 100) * 100) / 100,
    items: 1 + ((i * 5) % 4),
    payment: pay[i % 11 === 3 ? 3 : i % 7 === 5 ? 2 : i % 5 === 1 ? 1 : 0],
    fulfilment: ful[i < 9 ? 1 : i % 4 === 2 ? 2 : 0],
  };
});
const when = (d: Date) => `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;

const q = ref('');
const status = ref('');
const sort = ref<TableSort | null>({ key: 'date', direction: 'desc' });
const selected = ref<RowKey[]>([]);
const allMatching = ref(false);
const page = ref(1);
const size = ref(25);
const log = ref('');

const hits = computed(() => {
  const list = orders.filter(
    (o) => (!q.value || `#${o.id} ${o.customer}`.toLowerCase().includes(q.value.toLowerCase())) && (!status.value || o.fulfilment[0] === status.value),
  );
  const key = { date: (o: Order) => o.date.getTime(), total: (o: Order) => o.total, customer: (o: Order) => o.customer, id: (o: Order) => o.id }[
    (sort.value?.key ?? 'date') as 'date'
  ];
  const dir = sort.value?.direction === 'asc' ? 1 : -1;
  return [...list].sort((x, y) => (key(x) < key(y) ? -1 : key(x) > key(y) ? 1 : 0) * dir);
});
const pageRows = computed(() => hits.value.slice((page.value - 1) * size.value, page.value * size.value));
function reset() {
  page.value = 1;
  selected.value = [];
  allMatching.value = false;
}
// "Select all 128" acts on the query, not on the ticked keys.
const count = () => (allMatching.value ? hits.value.length : selected.value.length);
function fulfil() {
  log.value = `Marked ${count()} orders as fulfilled.`;
  reset();
}
</script>

<template>
  <div>
    <QTable
      v-model:sort="sort"
      v-model:selected="selected"
      v-model:all-matching="allMatching"
      caption="Orders"
      caption-hidden
      mobile="cards"
      manual-sort
      selectable
      row-key="id"
      :row-label="(o) => `order #${o.id}`"
      :total-count="hits.length"
      :rows="pageRows"
      :columns="[
        { key: 'id', header: 'Order', sortable: true, format: (o) => `#${o.id}` },
        { key: 'date', header: 'Date', sortable: true, sortLabels: ['Oldest first', 'Newest first'], sortFirst: 'desc', format: (o) => when(o.date) },
        { key: 'customer', header: 'Customer', sortable: true, truncate: true },
        { key: 'payment', header: 'Payment' },
        { key: 'fulfilment', header: 'Fulfilment' },
        { key: 'items', header: 'Items', numeric: true, mobile: false },
        { key: 'total', header: 'Total', numeric: true, sortable: true, sortLabels: ['Lowest total first', 'Highest total first'], format: (o) => money(o.total) },
      ]"
      @update:sort="page = 1"
      @row-click="(o) => (log = `Open order #${o.id}`)"
    >
      <template #toolbar>
        <QInput v-model="q" size="slim" class="search" aria-label="Search orders" placeholder="Search orders or customers" clearable @update:model-value="reset">
          <template #prefix><QIcon name="search" /></template>
        </QInput>
        <QSelect
          v-model="status"
          size="slim"
          class="filter"
          aria-label="Fulfilment"
          :options="[{ value: '', label: 'All fulfilment' }, 'Unfulfilled', 'Shipped', 'Fulfilled']"
          @update:model-value="reset"
        />
      </template>
      <template #cell-payment="{ row }"><QBadge :tone="row.payment[1]">{{ row.payment[0] }}</QBadge></template>
      <template #cell-fulfilment="{ row }"><QBadge :tone="row.fulfilment[1]">{{ row.fulfilment[0] }}</QBadge></template>
      <template #bulk-actions>
        <QButton size="slim" @click="fulfil">Mark as fulfilled</QButton>
        <QButton size="slim" icon-start="download" @click="log = `Exported ${count()} orders.`">Export</QButton>
      </template>
      <template #row-actions="{ row }">
        <QButton size="slim" variant="ghost" icon-start="download" :aria-label="`Download invoice for #${row.id}`" @click="log = `Invoice for #${row.id}`" />
      </template>
      <template #empty>
        <div class="empty-title">No orders match</div>
        Try another search or clear the filter.
      </template>
      <template #footer>
        <QPagination
          v-model:page="page"
          v-model:page-size="size"
          :total="hits.length"
          :page-size-options="[25, 50, 100]"
          @update:page="selected = []"
          @update:page-size="reset"
        />
      </template>
    </QTable>
    <p class="log" role="status">{{ log }}</p>
  </div>
</template>

<style scoped>
.search { flex: 1 1 200px; max-width: 320px; }
.filter { width: 160px; }
.empty-title { margin-bottom: 4px; color: var(--ink); font-weight: 500; }
.log { margin: var(--space-2) 0 0; min-height: 18px; font: var(--text-small); color: var(--ink-muted); }
</style>
