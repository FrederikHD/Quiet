<!-- pressed makes a secondary or ghost button a toggle: a view switch in a labelled group, or a filter that stays on. -->
<script setup lang="ts">
import { QButton } from 'quiet';
import { ref } from 'vue';

const view = ref<'grid' | 'list'>('grid');
const archived = ref(false);
</script>

<template>
  <div class="row">
    <span class="group" role="group" aria-label="View">
      <QButton icon-start="grid" aria-label="Grid view" :pressed="view === 'grid'" @click="view = 'grid'" />
      <QButton icon-start="list" aria-label="List view" :pressed="view === 'list'" @click="view = 'list'" />
    </span>
    <QButton :pressed="archived" @click="archived = !archived">Show archived</QButton>
  </div>
</template>

<style scoped>
.row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3); }
.group { display: inline-flex; gap: var(--space-1); }
</style>
