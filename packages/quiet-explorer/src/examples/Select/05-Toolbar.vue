<!-- Slim selects filter and sort a back-office list; prefix-icon marks the sort order. -->
<script setup lang="ts">
import { QSelect } from 'quiet';
import { reactive } from 'vue';

const view = reactive({ status: 'All statuses', sort: 'new' });
const sorts = [
  { value: 'new', label: 'Newest first' },
  { value: 'old', label: 'Oldest first' },
  { value: 'total', label: 'Highest total' },
];
</script>

<template>
  <div class="bar" data-density="compact">
    <QSelect v-model="view.status" size="slim" aria-label="Filter by status" :options="['All statuses', 'Unfulfilled', 'Fulfilled', 'Shipped', 'Cancelled']" />
    <QSelect v-model="view.sort" size="slim" aria-label="Sort orders" prefix-icon="sliders" :options="sorts" />
  </div>
</template>

<style scoped>
.bar { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.bar > * { flex: 0 1 200px; min-width: 0; }
</style>
