<!-- success for a good, lasting state; warning for something to look at soon; danger for something that blocks. -->
<script setup lang="ts">
import { QNotice } from '@frederikhd/quiet';
</script>

<template>
  <div class="stack">
    <QNotice tone="success" title="Your shop is live">Customers can order from shop.example.com.</QNotice>
    <QNotice tone="warning" title="Payment pending">The customer hasn’t paid yet. Wait before you ship.</QNotice>
    <QNotice tone="danger" title="Payment failed">The card was declined. The order won’t ship until the customer pays.</QNotice>
  </div>
</template>

<style scoped>
.stack { display: grid; gap: var(--space-3); }
</style>
