<!-- A round + button on the image, named "Add Linen napkins (4) to cart". Offer it only for products without choices. -->
<script setup lang="ts">
import { QProductCard } from '@frederikhd/quiet';
import { ref } from 'vue';
import { photo } from '../../fixtures/pictures';

const log = ref('');
</script>

<template>
  <QProductCard
    class="card"
    name="Linen napkins (4)"
    href="#linen-napkins"
    :image="{ src: photo('Natural', 2) }"
    :price="24"
    quick-add
    @quick-add="log = 'Added Linen napkins (4) to the cart'"
  />
  <p class="log" role="status">{{ log }}</p>
</template>

<style scoped>
.card {
  max-width: 240px;
}
.log {
  margin: 0;
  min-height: 18px;
  font: var(--text-small);
  color: var(--ink-muted);
}
</style>
