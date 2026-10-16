<script setup lang="ts">
import { QButton } from 'quiet';
</script>

<template>
  <div class="pv">
    <div v-for="d in ['comfortable', 'compact']" :key="d" class="pv-row" :data-density="d">
      <span class="pv-label">{{ d }}</span>
      <QButton variant="primary">Save changes</QButton>
      <QButton>Cancel</QButton>
      <QButton variant="ghost">Export</QButton>
      <QButton variant="danger-outline">Remove</QButton>
      <QButton variant="danger" icon-start="trash">Delete order</QButton>
    </div>
    <div class="pv-row" data-density="compact">
      <span class="pv-label">slim</span>
      <QButton size="slim" icon-start="pencil">Edit</QButton>
      <QButton size="slim" variant="ghost" icon-start="more" aria-label="More actions" />
      <QButton size="slim" variant="ghost">Clear filters</QButton>
      <QButton size="slim" variant="danger-outline">Remove</QButton>
    </div>
    <div class="pv-row">
      <span class="pv-label">large</span>
      <div class="cart"><QButton variant="primary" size="large" full-width>Add to cart</QButton></div>
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-4); }
.pv-row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3); }
.pv-label { width: 112px; flex: none; font: var(--text-caption); color: var(--ink-muted); }
.cart { width: 280px; max-width: 100%; }
</style>
