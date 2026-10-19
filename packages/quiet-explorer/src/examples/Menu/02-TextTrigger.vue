<!-- Your own Button as the trigger: "More actions ▾" beside a page's main buttons. -->
<script setup lang="ts">
import { QButton, QMenu } from '@frederikhd/quiet';
import { ref } from 'vue';

const chose = ref('');
</script>

<template>
  <div class="stack">
    <div class="row">
      <QButton icon-start="package">Print packing slip</QButton>
      <QMenu
        label="More actions"
        align="start"
        :items="[
          { label: 'Send invoice again', icon: 'mail' },
          { label: 'Refund', icon: 'credit-card' },
          { divider: true },
          { label: 'Cancel order', icon: 'x', danger: true },
        ]"
        @select="(item) => (chose = item.label ?? '')"
      >
        <template #trigger><QButton icon-end="chevron-down">More actions</QButton></template>
      </QMenu>
    </div>
    <p class="log" role="status">{{ chose && `Chose: ${chose}` }}</p>
  </div>
</template>

<style scoped>
.stack {
  display: grid;
  gap: var(--space-3);
}
.row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.log {
  margin: 0;
  min-height: 18px;
  font: var(--text-small);
  color: var(--ink-muted);
}
</style>
