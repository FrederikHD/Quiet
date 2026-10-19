<!-- A product without photos shows a placeholder in the same shape. -->
<script setup lang="ts">
import { QGallery } from '@frederikhd/quiet';
</script>

<template>
  <QGallery class="gallery" :images="[]" />
</template>

<style scoped>
.gallery {
  max-width: 240px;
}
</style>
