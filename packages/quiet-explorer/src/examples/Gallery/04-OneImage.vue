<!-- With a single image there are no arrows, counter or thumbnails; it still enlarges. -->
<script setup lang="ts">
import { QGallery } from '@frederikhd/quiet';
import { photo } from '../../fixtures/pictures';
</script>

<template>
  <QGallery
    class="gallery"
    label="Linen napkin images"
    :images="[{ src: photo('Natural', 2), alt: 'Linen napkins, natural, folded' }]"
  />
</template>

<style scoped>
.gallery {
  max-width: 360px;
}
</style>
