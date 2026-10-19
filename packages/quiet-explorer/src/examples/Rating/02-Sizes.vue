<!-- Small on product cards and reviews, default under the product title, large beside a large title. -->
<script setup lang="ts">
import { QRating } from '@frederikhd/quiet';
</script>

<template>
  <div class="stack">
    <QRating :value="3.6" :count="128" size="small" />
    <QRating :value="3.6" :count="128" />
    <QRating :value="3.6" :count="128" size="large" />
  </div>
</template>

<style scoped>
.stack { display: grid; justify-items: start; gap: var(--space-3); }
</style>
