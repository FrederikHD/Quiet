<!-- Secondary is the default; primary is the one action the view exists for; ghost, danger and danger-outline for the rest. -->
<script setup lang="ts">
import { QButton } from '@frederikhd/quiet';
</script>

<template>
  <div class="row">
    <QButton variant="primary">Save changes</QButton>
    <QButton>Cancel</QButton>
    <QButton variant="ghost">Clear filters</QButton>
    <QButton variant="danger-outline">Remove</QButton>
    <QButton variant="danger">Delete product</QButton>
  </div>
</template>

<style scoped>
.row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); }
</style>
