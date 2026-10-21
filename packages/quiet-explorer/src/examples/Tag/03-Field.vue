<!-- variant="field": the compact tag for chosen options inside a multi-select, with its own small ×. After a removal, focus moves to the next ×. -->
<script setup lang="ts">
import { QTag } from '@frederikhd/quiet';
import { nextTick, ref } from 'vue';

const collections = ref(['Summer linen', 'Gifts', 'New in']);
const row = ref<HTMLElement | null>(null);

async function remove(i: number) {
  collections.value.splice(i, 1);
  await nextTick();
  const buttons = row.value?.querySelectorAll<HTMLElement>('.q-tag__remove');
  buttons?.[Math.min(i, buttons.length - 1)]?.focus();
}
</script>

<template>
  <div ref="row" class="row">
    <QTag v-for="(c, i) in collections" :key="c" variant="field" removable @remove="remove(i)">
      {{ c }}
    </QTag>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}
</style>
