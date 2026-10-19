<!-- aspect="square" for goods photographed square. Keep one shape per catalogue. -->
<script setup lang="ts">
import { QProductCard } from '@frederikhd/quiet';
import { photo } from '../../fixtures/pictures';
</script>

<template>
  <div class="grid">
    <QProductCard
      aspect="square"
      name="Linen tea towel, sage"
      href="#tea-towel-sage"
      :image="{ src: photo('Sage', 2) }"
      :price="14"
    />
    <QProductCard
      aspect="square"
      name="Linen tea towel, natural"
      href="#tea-towel-natural"
      :image="{ src: photo('Natural', 2) }"
      :price="14"
    />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 200px));
  gap: var(--space-6) var(--space-4);
}
</style>
