<!-- Removable tags for the filters in use. The whole pill is the button; after a removal, focus moves to the next tag, and to "No filters" once none are left. -->
<script setup lang="ts">
import { QButton, QTag } from '@frederikhd/quiet';
import { nextTick, ref } from 'vue';

const filters = ref(['Linen', 'Size M', 'Under 60,00 €']);
const list = ref<HTMLElement | null>(null);

// The pressed button is gone: focus the tag that took its place, else the one before, else the empty message.
async function focusAfterRemoval(i: number) {
  await nextTick();
  const tags = list.value?.querySelectorAll<HTMLElement>('.q-tag');
  const next = tags?.length ? tags[Math.min(i, tags.length - 1)] : list.value?.querySelector<HTMLElement>('.none');
  next?.focus();
}
function remove(i: number) {
  filters.value.splice(i, 1);
  focusAfterRemoval(i);
}
function clearAll() {
  filters.value = [];
  focusAfterRemoval(0);
}
</script>

<template>
  <div ref="list" class="row">
    <QTag v-for="(f, i) in filters" :key="f" removable @remove="remove(i)">{{ f }}</QTag>
    <QButton v-if="filters.length" variant="ghost" @click="clearAll">Clear all</QButton>
    <span v-else class="none" tabindex="-1">No filters</span>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}
.none {
  color: var(--ink-muted);
}
</style>
