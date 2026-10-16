<script setup lang="ts">
import { QTag } from 'quiet';
import { ref } from 'vue';

const log = ref('');
</script>

<template>
  <div class="pv">
    <div>
      <p class="pv-title">Pill</p>
      <div class="row">
        <QTag>Summer linen</QTag>
        <QTag swatch="hsl(222 32% 45%)" removable remove-label="Remove filter: Navy" @remove="log = 'Removed Navy'">Navy</QTag>
        <QTag icon="tag" detail="−10 %" removable remove-label="Remove discount LINEN10" @remove="log = 'Removed LINEN10'">LINEN10</QTag>
      </div>
    </div>
    <div>
      <p class="pv-title">Field (inside a multi-select)</p>
      <div class="row">
        <QTag variant="field" removable @remove="log = 'Removed Summer linen'">Summer linen</QTag>
        <QTag variant="field" removable @remove="log = 'Removed Gifts'">Gifts</QTag>
      </div>
    </div>
    <p class="log" role="status">{{ log }}</p>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-4); }
.row { display: flex; flex-wrap: wrap; gap: var(--space-2); align-items: center; }
.pv-title { margin: 0 0 var(--space-2); font: var(--text-caption); color: var(--ink-muted); }
.log { margin: 0; min-height: 18px; font: var(--text-small); color: var(--ink-muted); }
</style>
