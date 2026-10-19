<!-- An optional icon before the word. The word still carries the meaning. -->
<script setup lang="ts">
import { QBadge } from '@frederikhd/quiet';
</script>

<template>
  <div class="row">
    <QBadge tone="info" icon="truck">Shipped</QBadge>
    <QBadge tone="info" icon="clock">Pre-order</QBadge>
    <QBadge tone="success" icon="check">Delivered</QBadge>
  </div>
</template>

<style scoped>
.row { display: flex; flex-wrap: wrap; gap: var(--space-2); }
</style>
