<!-- The #item slot puts more than text on an item's label line, such as a count. -->
<script setup lang="ts">
import { QBadge, QButton, QMenu, type MenuItem } from '@frederikhd/quiet';

const counts: Record<string, number> = { 'Summer linen': 24, Shirts: 18, Home: 9 };
const items: MenuItem[] = Object.keys(counts).map((label) => ({ label, icon: 'grid' }));
</script>

<template>
  <QMenu label="Add to collection" align="start" :items="items">
    <template #trigger><QButton icon-end="chevron-down">Add to collection</QButton></template>
    <template #item="{ item }">
      <span class="item"
        >{{ item.label }}<QBadge>{{ counts[item.label ?? ''] }} products</QBadge></span
      >
    </template>
  </QMenu>
</template>

<style scoped>
.item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
}
</style>
