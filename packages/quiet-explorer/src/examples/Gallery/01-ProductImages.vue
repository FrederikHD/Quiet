<script setup lang="ts">
import { QGallery, QRadio, QRadioGroup } from 'quiet';
import { computed, ref } from 'vue';
import { photo, swatchOf } from '../../fixtures/pictures';

const colour = ref('Navy');
const images = computed(() =>
  [0, 1, 2].map((v) => ({ src: photo(colour.value, v), alt: `Linen shirt in ${colour.value.toLowerCase()}, ${['front', 'back', 'folded'][v]}` })),
);
</script>

<template>
  <div class="pv">
    <div class="col">
      <p class="pv-title">Three images — pick another colour and it starts again</p>
      <QGallery :images="images" label="Linen shirt images" />
      <QRadioGroup v-model="colour" label="Colour" layout="swatches" class="swatches">
        <QRadio v-for="n in ['Navy', 'Sand', 'Olive']" :key="n" :value="n" :label="n" :swatch="swatchOf(n)" />
      </QRadioGroup>
    </div>
    <div class="col">
      <p class="pv-title">One image, square</p>
      <QGallery aspect="square" :images="[{ src: photo('Natural', 2), alt: 'Linen napkins, natural' }]" />
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); gap: var(--space-8); align-items: start; }
.pv-title { margin: 0 0 var(--space-2); font: var(--text-caption); color: var(--ink-muted); }
.col { max-width: 420px; min-width: 0; }
.swatches { margin-top: var(--space-4); }
</style>
