<!-- Colour dots and size tiles in the shop's filter panel; options with no products behind them are disabled. -->
<script setup lang="ts">
import { QCheckbox, QCheckboxGroup, QForm } from '@frederikhd/quiet';
import { ref } from 'vue';
import { swatchOf } from '../../fixtures/pictures';

const colours = [
  { name: 'Navy', count: 6 },
  { name: 'Sand', count: 4 },
  { name: 'Olive', count: 3 },
  { name: 'Rust', count: 0 },
];
const colour = ref<string[]>(['Navy', 'Sand']);
const size = ref<string[]>(['M', 'L']);
</script>

<template>
  <QForm label-placement="top">
    <QCheckboxGroup v-model="colour" label="Colour" layout="swatches">
      <QCheckbox
        v-for="c in colours"
        :key="c.name"
        :value="c.name"
        :label="c.name"
        :swatch="swatchOf(c.name)"
        :description="`${c.count} products`"
        :disabled="!c.count"
      />
    </QCheckboxGroup>
    <QCheckboxGroup v-model="size" label="Size" layout="buttons">
      <QCheckbox v-for="s in ['XS', 'S', 'M', 'L', 'XL']" :key="s" :value="s" :label="s" :disabled="s === 'XS'" />
    </QCheckboxGroup>
  </QForm>
</template>
