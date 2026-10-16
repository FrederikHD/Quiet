<script setup lang="ts">
import { QButton, QMenu, type MenuItem } from 'quiet';
import { ref } from 'vue';

const log = ref('');
const act = (what: string) => () => (log.value = what);
const rowItems: MenuItem[] = [
  { label: 'Edit', icon: 'pencil', onSelect: act('Edit') },
  { label: 'Duplicate', icon: 'copy', onSelect: act('Duplicate') },
  { label: 'View in shop', icon: 'external-link', onSelect: act('View in shop') },
  { divider: true },
  { label: 'Archive', icon: 'package', description: 'Hidden, kept in reports', onSelect: act('Archive') },
  { label: 'Delete', icon: 'trash', danger: true, onSelect: act('Delete') },
];
const orderItems: MenuItem[] = [
  { label: 'Print packing slip', icon: 'package', onSelect: act('Packing slip') },
  { label: 'Send invoice again', icon: 'mail', onSelect: act('Invoice') },
  { label: 'Edit shipping address', icon: 'pencil', disabled: true, description: 'Locked once shipped' },
  { divider: true },
  { label: 'Cancel order', icon: 'x', danger: true, onSelect: act('Cancel order') },
];
</script>

<template>
  <div class="pv">
    <div class="item">
      <span>Linen shirt, blue</span>
      <QMenu label="Actions for Linen shirt, blue" :items="rowItems" />
    </div>
    <div>
      <QMenu label="More actions" align="start" :items="orderItems">
        <template #trigger><QButton icon-end="chevron-down">More actions</QButton></template>
      </QMenu>
    </div>
    <p class="log" role="status">{{ log ? `Chose: ${log}` : '' }}</p>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-6); }
.item { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); max-width: 420px; padding: var(--space-2) var(--space-2) var(--space-2) var(--space-4); background: var(--surface-raised); border: 1px solid var(--line); border-radius: var(--radius-lg); }
.log { margin: 0; min-height: 18px; font: var(--text-small); color: var(--ink-muted); }
</style>
