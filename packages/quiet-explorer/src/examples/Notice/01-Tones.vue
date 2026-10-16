<script setup lang="ts">
import { QButton, QNotice } from 'quiet';
import { ref } from 'vue';

const show = ref(true);
</script>

<template>
  <div class="pv">
    <QNotice>Example shop: nothing is charged and nothing leaves this page.</QNotice>
    <QNotice tone="success" title="Your shop is live">Customers can order from shop.example.com.</QNotice>
    <QNotice tone="warning" title="3 products are out of stock">
      They’re hidden from the shop until you restock them.
      <template #actions><QButton size="slim" href="#inventory">Open inventory</QButton></template>
    </QNotice>
    <QNotice v-if="show" tone="danger" title="Payment failed" dismissible @dismiss="show = false">
      The card was declined. The order won’t ship until the customer pays.
    </QNotice>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-3); max-width: 560px; }
</style>
