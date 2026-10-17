<!-- sm (16px) for dense rows and badges, md (20px) for controls and navigation, lg (24px) for the storefront header. -->
<script setup lang="ts">
import { QIcon } from 'quiet';
</script>

<template>
  <div class="row">
    <span class="size"><QIcon name="cart" size="sm" />sm</span>
    <span class="size"><QIcon name="cart" />md</span>
    <span class="size"><QIcon name="cart" size="lg" />lg</span>
  </div>
</template>

<style scoped>
.row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-6); }
.size { display: inline-flex; align-items: center; gap: var(--space-2); font: var(--text-small); color: var(--ink-muted); }
.size .q-icon { color: var(--ink); }
</style>
