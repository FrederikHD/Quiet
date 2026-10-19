<!-- A colour filter with swatches; the meta lists the chosen colours. -->
<script setup lang="ts">
import { QCheckbox, QCheckboxGroup, QDisclosure } from '@frederikhd/quiet';
import { ref } from 'vue';
import { COLOURS, swatchOf } from '../../fixtures/pictures';

const colours = ref<string[]>(['Navy', 'Sand']);
</script>

<template>
  <div class="filters">
    <QDisclosure title="Colour" :meta="colours.join(', ')" default-open>
      <QCheckboxGroup v-model="colours" label="Colour" label-hidden layout="swatches">
        <QCheckbox v-for="c in Object.keys(COLOURS)" :key="c" :value="c" :label="c" :swatch="swatchOf(c)" />
      </QCheckboxGroup>
    </QDisclosure>
  </div>
</template>

<style scoped>
.filters { max-width: 320px; }
</style>
