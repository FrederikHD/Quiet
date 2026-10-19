<!-- Saved filters over one list: no tab has its own panel, so every tab controls the same one. -->
<script setup lang="ts">
import { QBadge, QTabs } from '@frederikhd/quiet';
import { computed, ref } from 'vue';

const orders = [
  { id: '#10530', status: 'Unfulfilled', paid: true },
  { id: '#10529', status: 'Unfulfilled', paid: false },
  { id: '#10528', status: 'Shipped', paid: true },
  { id: '#10527', status: 'Fulfilled', paid: true },
];
const filters: Record<string, (o: (typeof orders)[number]) => boolean> = {
  all: () => true,
  open: (o) => o.status === 'Unfulfilled',
  unpaid: (o) => !o.paid,
};
const view = ref('all');
const rows = computed(() => orders.filter(filters[view.value]));
const count = (key: string) => orders.filter(filters[key]).length;
</script>

<template>
  <QTabs
    v-model="view"
    label="Order views"
    class="tabs"
    :tabs="[
      { value: 'all', label: 'All' },
      { value: 'open', label: 'Unfulfilled', count: count('open'), countLabel: 'orders to fulfil' },
      { value: 'unpaid', label: 'Unpaid', count: count('unpaid'), countLabel: 'unpaid orders' },
    ]"
  >
    <ul class="list">
      <li v-for="o in rows" :key="o.id">
        {{ o.id }}<QBadge :tone="o.status === 'Unfulfilled' ? 'warning' : 'success'">{{ o.status }}</QBadge>
      </li>
    </ul>
  </QTabs>
</template>

<style scoped>
.tabs { max-width: 640px; }
.list { margin: 0; padding: 0; list-style: none; border: 1px solid var(--line); border-radius: var(--radius-lg); background: var(--surface-raised); }
.list li { display: flex; justify-content: space-between; gap: var(--space-3); padding: var(--space-3) var(--space-4); border-top: 1px solid var(--line); }
.list li:first-child { border-top: 0; }
</style>
