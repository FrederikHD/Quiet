<!-- Small on product cards and cart lines, default in lists, large on the product page. -->
<script setup lang="ts">
import { QPrice } from '@frederikhd/quiet';
</script>

<template>
  <div class="row">
    <QPrice :amount="24" :compare-at="35" size="small" />
    <QPrice :amount="24" :compare-at="35" />
    <QPrice :amount="24" :compare-at="35" size="large" />
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-4) var(--space-8);
}
</style>
