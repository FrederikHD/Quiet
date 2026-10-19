<!-- aspect="square" for catalogues photographed square; match the ProductCards. -->
<script setup lang="ts">
import { QGallery } from '@frederikhd/quiet';
import { photo } from '../../fixtures/pictures';

const images = [
  { src: photo('Sage', 2), alt: 'Linen tea towels in sage, folded' },
  { src: photo('Natural', 2), alt: 'Linen tea towels in natural, folded' },
];
</script>

<template>
  <QGallery class="gallery" aspect="square" label="Linen tea towel images" :images="images" />
</template>

<style scoped>
.gallery { max-width: 360px; }
</style>
