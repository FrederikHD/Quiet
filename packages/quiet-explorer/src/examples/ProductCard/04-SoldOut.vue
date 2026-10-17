<!-- Sold out dims the image and hides quick add; the card still opens the product. -->
<script setup lang="ts">
import { QProductCard } from 'quiet';
import { photo } from '../../fixtures/pictures';
</script>

<template>
  <QProductCard
    class="card"
    name="Linen apron"
    href="#linen-apron"
    :image="{ src: photo('Rust', 2) }"
    :price="35"
    sold-out
    quick-add
    :badges="[{ label: 'Sold out', tone: 'neutral' }]"
  />
</template>

<style scoped>
.card { max-width: 240px; }
</style>
