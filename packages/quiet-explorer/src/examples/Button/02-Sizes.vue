<!-- slim (28px) for table cells and filter bars, default follows the density, large (48px) for storefront actions. -->
<script setup lang="ts">
import { QButton } from '@frederikhd/quiet';
</script>

<template>
  <div class="row">
    <QButton size="slim">Edit</QButton>
    <QButton>Export</QButton>
    <QButton variant="primary" size="large">Checkout</QButton>
  </div>
</template>

<style scoped>
.row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); }
</style>
