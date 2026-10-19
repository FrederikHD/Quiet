<!-- align="end" lines the panel up with the trigger's right edge, for a button at the end of a toolbar. -->
<script setup lang="ts">
import { QButton, QCheckbox, QCheckboxGroup, QPopover } from '@frederikhd/quiet';
import { ref } from 'vue';

const columns = ['Product', 'SKU', 'Price', 'Stock', 'Status'];
const shown = ref(['Product', 'Price', 'Stock']);
</script>

<template>
  <div class="toolbar">
    <span class="count">24 products</span>
    <QPopover label="Columns" align="end">
      <QButton icon-start="sliders">Columns</QButton>
      <template #content>
        <QCheckboxGroup v-model="shown" label="Show columns">
          <QCheckbox v-for="c in columns" :key="c" :value="c" :label="c" />
        </QCheckboxGroup>
      </template>
    </QPopover>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}
.count {
  color: var(--ink-muted);
}
</style>
