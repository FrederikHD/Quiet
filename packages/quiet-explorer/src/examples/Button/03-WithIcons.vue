<!-- An icon before the label names the object, an icon after it shows direction; an icon-only button needs an aria-label. -->
<script setup lang="ts">
import { QButton } from 'quiet';
</script>

<template>
  <div class="row">
    <QButton variant="primary" icon-start="plus">Add product</QButton>
    <QButton icon-end="arrow-right">View order</QButton>
    <QButton variant="ghost" icon-start="trash" aria-label="Delete Linen shirt, blue" />
  </div>
</template>

<style scoped>
.row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); }
</style>
