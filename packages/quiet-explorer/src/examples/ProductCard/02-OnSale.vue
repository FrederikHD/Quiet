<!-- A sale shows the old price struck through, with a Sale badge on the image. -->
<script setup lang="ts">
import { QProductCard } from 'quiet';
import { photo } from '../../fixtures/pictures';
</script>

<template>
  <QProductCard
    class="card"
    name="Linen trousers"
    href="#linen-trousers"
    :image="{ src: photo('Sand', 2) }"
    :price="59"
    :compare-at="79"
    :badges="[{ label: 'Sale', tone: 'sale' }]"
  />
</template>

<style scoped>
.card { max-width: 240px; }
</style>
