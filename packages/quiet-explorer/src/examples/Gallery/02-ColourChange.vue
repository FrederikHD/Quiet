<!-- Pick another colour and the gallery shows its images, starting again at the first. -->
<script setup lang="ts">
import { QGallery, QRadio, QRadioGroup } from '@frederikhd/quiet';
import { computed, ref } from 'vue';
import { photo, swatchOf } from '../../fixtures/pictures';

const colour = ref('Navy');
const images = computed(() =>
  ['front', 'back', 'folded'].map((view, i) => ({ src: photo(colour.value, i), alt: `Linen shirt in ${colour.value.toLowerCase()}, ${view}` })),
);
</script>

<template>
  <div class="product">
    <QGallery label="Linen shirt images" :images="images" />
    <QRadioGroup v-model="colour" label="Colour" layout="swatches">
      <QRadio v-for="n in ['Navy', 'Sand', 'Olive']" :key="n" :value="n" :label="n" :swatch="swatchOf(n)" />
    </QRadioGroup>
  </div>
</template>

<style scoped>
.product { display: grid; gap: var(--space-4); max-width: 420px; }
</style>
