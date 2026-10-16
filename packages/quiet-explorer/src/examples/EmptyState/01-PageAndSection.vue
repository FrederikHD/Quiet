<script setup lang="ts">
import { QButton, QEmptyState } from 'quiet';
</script>

<template>
  <div class="pv">
    <div class="box">
      <QEmptyState icon="filter" title="No products match these filters">
        <p>Try removing a filter or two.</p>
        <template #actions><QButton>Clear filters</QButton></template>
      </QEmptyState>
    </div>
    <div class="box">
      <QEmptyState size="small" icon="star" :heading-level="3" title="No reviews yet">
        <p>Bought this shirt? Tell others how it fits and wears.</p>
        <template #actions><QButton icon-start="pencil">Write a review</QButton></template>
      </QEmptyState>
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-4); }
.box { border: 1px dashed var(--line); border-radius: var(--radius-md); }
</style>
