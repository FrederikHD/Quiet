<script setup lang="ts">
import { QBadge, QTabs } from 'quiet';
import { computed, ref } from 'vue';

const ORDERS = [
  ['#10530', 'Unfulfilled', 'Paid'],
  ['#10529', 'Unfulfilled', 'Pending'],
  ['#10528', 'Shipped', 'Paid'],
  ['#10527', 'Fulfilled', 'Paid'],
  ['#10526', 'Unfulfilled', 'Paid'],
];
const view = ref('all');
const rows = computed(() =>
  ORDERS.filter((o) => view.value === 'all' || (view.value === 'open' ? o[1] === 'Unfulfilled' : view.value === 'unpaid' ? o[2] === 'Pending' : o[1] !== 'Unfulfilled')),
);
const count = (f: (o: string[]) => boolean) => ORDERS.filter(f).length;
</script>

<template>
  <div class="pv">
    <div class="box">
      <p class="pv-title">line — a panel per tab</p>
      <QTabs
        label="Order"
        :tabs="[
          { value: 'details', label: 'Details' },
          { value: 'timeline', label: 'Timeline', count: 4, countLabel: '4 events' },
          { value: 'returns', label: 'Returns', disabled: true },
        ]"
      >
        <template #panel-details><p>3 items · Standard shipping to Dresden.</p></template>
        <template #panel-timeline><p>Paid · Confirmation sent · Packed · Label printed</p></template>
        <template #panel-returns />
      </QTabs>
    </div>
    <div class="box">
      <p class="pv-title">One shared panel — saved filters over a list</p>
      <QTabs
        v-model="view"
        label="Order views"
        :tabs="[
          { value: 'all', label: 'All' },
          { value: 'open', label: 'Unfulfilled', count: count((o) => o[1] === 'Unfulfilled'), countLabel: 'orders to fulfil' },
          { value: 'unpaid', label: 'Unpaid', count: count((o) => o[2] === 'Pending'), countLabel: 'unpaid orders' },
          { value: 'done', label: 'Shipped' },
        ]"
      >
        <ul class="list">
          <li v-for="o in rows" :key="o[0]">
            <span>{{ o[0] }}</span><QBadge :tone="o[1] === 'Unfulfilled' ? 'warning' : 'success'">{{ o[1] }}</QBadge>
          </li>
        </ul>
      </QTabs>
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-8); }
.pv-title { margin: 0 0 var(--space-2); font: var(--text-small); color: var(--ink-muted); }
.box { max-width: 640px; }
p { margin: 0; }
.list { margin: 0; padding: 0; list-style: none; border: 1px solid var(--line); border-radius: var(--radius-lg); background: var(--surface-raised); }
.list li { display: flex; justify-content: space-between; gap: var(--space-3); padding: var(--space-3) var(--space-4); border-top: 1px solid var(--line); }
.list li:first-child { border-top: 0; }
</style>
