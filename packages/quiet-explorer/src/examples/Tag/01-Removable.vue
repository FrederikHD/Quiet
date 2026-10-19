<!-- Removable tags for the filters in use. The whole pill is the button; after a removal, focus moves to the next tag. -->
<script setup lang="ts">
import { QButton, QTag } from '@frederikhd/quiet';
import { nextTick, ref } from 'vue';

const filters = ref(['Linen', 'Size M', 'Under 60,00 €']);
const list = ref<HTMLElement | null>(null);

async function remove(i: number) {
  filters.value.splice(i, 1);
  await nextTick();
  const tags = list.value?.querySelectorAll<HTMLElement>('button');
  tags?.[Math.min(i, tags.length - 1)]?.focus();
}
</script>

<template>
  <div ref="list" class="row">
    <QTag v-for="(f, i) in filters" :key="f" removable @remove="remove(i)">{{ f }}</QTag>
    <QButton v-if="filters.length" variant="ghost" @click="filters = []">Clear all</QButton>
    <span v-else class="none">No filters</span>
  </div>
</template>

<style scoped>
.row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); }
.none { color: var(--ink-muted); }
</style>
