<!-- While the first rows load, loading shows skeleton rows and sets aria-busy; with rows already there it dims them. -->
<script setup lang="ts">
import { QTable } from 'quiet';
</script>

<template>
  <QTable
    caption="Orders"
    loading
    :skeleton-rows="3"
    :rows="[]"
    :columns="[
      { key: 'id', header: 'Order' },
      { key: 'customer', header: 'Customer' },
      { key: 'total', header: 'Total', numeric: true },
    ]"
  />
</template>
