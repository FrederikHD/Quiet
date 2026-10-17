<!-- Says what's empty, what to do, and offers the action that does it. -->
<script setup lang="ts">
import { QButton, QEmptyState } from 'quiet';
</script>

<template>
  <QEmptyState icon="filter" title="No products match these filters">
    <p>Try removing a filter or two.</p>
    <template #actions><QButton>Clear filters</QButton></template>
  </QEmptyState>
</template>
