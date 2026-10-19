<!-- The image, the name and the price. The name is the card's one link, and it covers the whole card. -->
<script setup lang="ts">
import { QProductCard } from '@frederikhd/quiet';
import { photo } from '../../fixtures/pictures';
</script>

<template>
  <QProductCard class="card" name="Linen shirt" href="#linen-shirt" :image="{ src: photo('Navy') }" :price="59" />
</template>

<style scoped>
.card { max-width: 240px; }
</style>
