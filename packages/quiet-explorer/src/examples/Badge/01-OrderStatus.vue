<!-- One badge per fact: an order shows its payment status and its fulfilment status side by side. -->
<script setup lang="ts">
import { QBadge } from '@frederikhd/quiet';
</script>

<template>
  <div class="order">
    <strong>Order #1049</strong>
    <QBadge tone="success">Paid</QBadge>
    <QBadge tone="warning">Unfulfilled</QBadge>
  </div>
</template>

<style scoped>
.order { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); }
</style>
