<!-- :thumbnails="false" leaves only the arrows, for quick views and narrow columns. -->
<script setup lang="ts">
import { QGallery } from '@frederikhd/quiet';
import { photo } from '../../fixtures/pictures';

const images = [
  { src: photo('Rust', 0), alt: 'Linen shirt in rust, front' },
  { src: photo('Rust', 1), alt: 'Linen shirt in rust, back' },
];
</script>

<template>
  <QGallery class="gallery" label="Quick view: linen shirt" :thumbnails="false" :images="images" />
</template>

<style scoped>
.gallery { max-width: 320px; }
</style>
