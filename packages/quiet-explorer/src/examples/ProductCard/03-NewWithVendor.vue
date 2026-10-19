<!-- A New badge, the maker above the name, and a from-price when the variants cost different amounts. -->
<script setup lang="ts">
import { QProductCard } from '@frederikhd/quiet';
import { photo } from '../../fixtures/pictures';
</script>

<template>
  <QProductCard
    class="card"
    name="Linen dress, wide-cut with pockets"
    vendor="Leinenweberei Rhön"
    href="#linen-dress"
    :image="{ src: photo('Olive') }"
    :price="99"
    price-from
    :badges="[{ label: 'New', tone: 'info' }]"
  />
</template>

<style scoped>
.card {
  max-width: 240px;
}
</style>
