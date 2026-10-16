<script setup lang="ts">
import { QButton } from 'quiet';
import { ref } from 'vue';

const view = ref<'grid' | 'list'>('grid');
const archived = ref(true);
const menuOpen = ref(true);
</script>

<template>
  <div class="pv" data-density="compact">
    <div class="pv-row">
      <span class="pv-label">With icons</span>
      <QButton variant="primary" icon-start="plus">Add product</QButton>
      <QButton icon-end="arrow-right">View order</QButton>
      <QButton variant="ghost" icon-start="more" aria-label="More actions" />
    </div>
    <div class="pv-row">
      <span class="pv-label">Selected / menu</span>
      <span class="group" role="group" aria-label="View">
        <QButton icon-start="grid" :pressed="view === 'grid'" aria-label="Grid view" @click="view = 'grid'" />
        <QButton icon-start="list" :pressed="view === 'list'" aria-label="List view" @click="view = 'list'" />
      </span>
      <QButton :pressed="archived" @click="archived = !archived">Show archived</QButton>
      <QButton icon-end="chevron-down" :expanded="menuOpen" aria-haspopup="menu" @click="menuOpen = !menuOpen">Bulk actions</QButton>
    </div>
    <div class="pv-row" data-density="comfortable">
      <span class="pv-label">Loading / disabled</span>
      <QButton variant="primary" loading>Saving</QButton>
      <QButton variant="primary" disabled>Save changes</QButton>
      <QButton disabled>Cancel</QButton>
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-4); }
.pv-row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3); }
.pv-label { width: 112px; flex: none; font: var(--text-caption); color: var(--ink-muted); }
.group { display: inline-flex; gap: var(--space-1); }
</style>
