<!-- The ⋯ button on a list row, named after the row. Destructive actions go last, after a divider. -->
<script setup lang="ts">
import { QMenu, type MenuItem } from '@frederikhd/quiet';
import { ref } from 'vue';

const chose = ref('');
const pick = (what: string) => () => (chose.value = what);
const items: MenuItem[] = [
  { label: 'Edit', icon: 'pencil', onSelect: pick('Edit') },
  { label: 'Duplicate', icon: 'copy', onSelect: pick('Duplicate') },
  { label: 'View in shop', icon: 'external-link', onSelect: pick('View in shop') },
  { divider: true },
  { label: 'Archive', icon: 'package', description: 'Hidden, kept in reports', onSelect: pick('Archive') },
  { label: 'Delete', icon: 'trash', danger: true, onSelect: pick('Delete') },
];
</script>

<template>
  <div class="stack">
    <div class="row">
      <span>Linen shirt, blue</span>
      <QMenu label="Actions for Linen shirt, blue" :items="items" />
    </div>
    <p class="log" role="status">{{ chose && `Chose: ${chose}` }}</p>
  </div>
</template>

<style scoped>
.stack {
  display: grid;
  gap: var(--space-3);
  max-width: 420px;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-2) var(--space-2) var(--space-4);
  background: var(--surface-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
}
.log {
  margin: 0;
  min-height: 18px;
  font: var(--text-small);
  color: var(--ink-muted);
}
</style>
