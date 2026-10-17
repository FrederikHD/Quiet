<!-- Swipe on a phone; arrows, thumbnails and ← → on a computer; click the image to enlarge it. -->
<script setup lang="ts">
import { QGallery } from 'quiet';
import { photo } from '../../fixtures/pictures';

const images = [
  { src: photo('Navy', 0), alt: 'Linen shirt in navy, front' },
  { src: photo('Navy', 1), alt: 'Linen shirt in navy, back' },
  { src: photo('Navy', 2), alt: 'Linen shirt in navy, folded' },
];
</script>

<template>
  <QGallery class="gallery" label="Linen shirt images" :images="images" />
</template>

<style scoped>
.gallery { max-width: 420px; }
</style>
