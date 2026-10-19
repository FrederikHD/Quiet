<!-- Small stars and the count under the price; hidden while there are no reviews. -->
<script setup lang="ts">
import { QProductCard } from '@frederikhd/quiet';
import { photo } from '../../fixtures/pictures';
</script>

<template>
  <QProductCard class="card" name="Linen bed sheet" href="#linen-bed-sheet" :image="{ src: photo('Natural', 2) }" :price="89" :rating="{ value: 4.6, count: 128 }" />
</template>

<style scoped>
.card { max-width: 240px; }
</style>
