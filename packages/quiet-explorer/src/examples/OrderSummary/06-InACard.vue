<!-- In the back office's order view: inside a Card that has the heading, so :title="null"; the names link to the products. -->
<script setup lang="ts">
import { QCard, QOrderSummary } from 'quiet';
import { photo } from '../../fixtures/pictures';
</script>

<template>
  <QCard title="Order #10421" :heading-level="3" class="card">
    <QOrderSummary
      :title="null"
      :items="[
        { name: 'Linen shirt', variant: 'Blue · M', quantity: 2, price: 118, href: '#product-shirt', image: { src: photo('Blue') } },
        { name: 'Linen napkins (4)', variant: 'Natural', price: 24, href: '#product-napkins', image: { src: photo('Natural', 2) } },
      ]"
      :totals="[{ label: 'Shipping', detail: 'DHL Paket', amount: 4.9 }]"
      :total="146.9"
      tax-note="Including 23,45 € VAT (19 %)"
    />
  </QCard>
</template>

<style scoped>
.card { max-width: 480px; }
</style>
