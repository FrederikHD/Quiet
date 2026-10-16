<script setup lang="ts">
import { QButton } from 'quiet';
</script>

<template>
  <div class="row">
    <QButton variant="primary">Save changes</QButton>
    <QButton>Cancel</QButton>
    <QButton variant="ghost">Clear filters</QButton>
    <QButton variant="danger">Delete product</QButton>
    <QButton variant="danger-outline">Remove</QButton>
  </div>
</template>

<style scoped>
.row { display: flex; flex-wrap: wrap; gap: var(--space-2); align-items: center; }
</style>
