<!-- @row-click (or row-href for a link) makes the first column the real button, and a click anywhere on the row follows it. -->
<script setup lang="ts">
import { QTable, money } from 'quiet';
import { ref } from 'vue';

const customers = [
  { id: 'c1', name: 'Anna Schmidt', city: 'Berlin', orders: 6, spent: 486.4 },
  { id: 'c2', name: 'Jonas Weber', city: 'Hamburg', orders: 2, spent: 118 },
  { id: 'c3', name: 'Lea Fischer', city: 'München', orders: 11, spent: 1240.5 },
];
const log = ref('');
</script>

<template>
  <QTable
    caption="Customers"
    :rows="customers"
    :columns="[
      { key: 'name', header: 'Name' },
      { key: 'city', header: 'City' },
      { key: 'orders', header: 'Orders', numeric: true },
      { key: 'spent', header: 'Spent', numeric: true, format: (c) => money(c.spent) },
    ]"
    @row-click="(c) => (log = `Opened ${c.name}`)"
  />
  <p class="log" role="status">{{ log }}</p>
</template>

<style scoped>
.log { margin: 0; min-height: 18px; font: var(--text-small); color: var(--ink-muted); }
</style>
