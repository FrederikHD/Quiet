<!-- Colour dots for a product's colours; the chosen name shows beside the label. Rust is sold out but still choosable. -->
<script setup lang="ts">
import { QRadio, QRadioGroup } from 'quiet';
import { ref } from 'vue';
import { swatchOf } from '../../fixtures/pictures';

const colour = ref('Navy');
</script>

<template>
  <QRadioGroup v-model="colour" label="Colour" layout="swatches" label-placement="top">
    <QRadio
      v-for="c in ['Navy', 'Sand', 'Olive', 'Rust', 'Natural']"
      :key="c"
      :value="c"
      :label="c"
      :swatch="swatchOf(c)"
      :sold-out="c === 'Rust'"
    />
  </QRadioGroup>
</template>
