<!-- Up to five colour dots, then "+1"; screen readers hear "6 colours: Navy, Sand, …". -->
<script setup lang="ts">
import { QProductCard } from 'quiet';
import { photo, swatchOf } from '../../fixtures/pictures';

const swatches = ['Navy', 'Sand', 'Olive', 'Rust', 'Natural', 'Sage'].map((n) => ({ label: n, color: swatchOf(n) }));
</script>

<template>
  <QProductCard
    class="card"
    name="Linen shirt"
    href="#linen-shirt"
    :image="{ src: photo('Sage') }"
    :price="59"
    :swatches="swatches"
  />
</template>

<style scoped>
.card { max-width: 240px; }
</style>
