<!-- A button that opens a menu keeps its hover look while the menu is open; a chevron after the label says it opens. -->
<script setup lang="ts">
import { QButton, QMenu } from '@frederikhd/quiet';
import { ref } from 'vue';

const done = ref('');
</script>

<template>
  <div class="stack">
    <QMenu
      label="Bulk actions"
      align="start"
      :items="[
        { label: 'Mark as fulfilled', icon: 'check', onSelect: () => (done = '3 orders marked as fulfilled.') },
        {
          label: 'Print packing slips',
          icon: 'package',
          onSelect: () => (done = '3 packing slips sent to the printer.'),
        },
      ]"
    >
      <template #trigger><QButton icon-end="chevron-down">Bulk actions</QButton></template>
    </QMenu>
    <p class="log" role="status">{{ done }}</p>
  </div>
</template>

<style scoped>
.stack {
  display: grid;
  justify-items: start;
  gap: var(--space-3);
}
.log {
  margin: 0;
  min-height: 18px;
  font: var(--text-small);
  color: var(--ink-muted);
}
</style>
