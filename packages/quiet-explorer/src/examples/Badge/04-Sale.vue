<!-- tone="sale" is the storefront's Sale tag, next to the reduced price. -->
<script setup lang="ts">
import { QBadge, QPrice } from '@frederikhd/quiet';
</script>

<template>
  <div class="product">
    <div class="name">Linen shirt, blue <QBadge tone="sale">Sale</QBadge></div>
    <QPrice :amount="41.3" :compare-at="59" />
  </div>
</template>

<style scoped>
.product { display: grid; gap: var(--space-1); }
.name { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); font-weight: 600; }
</style>
