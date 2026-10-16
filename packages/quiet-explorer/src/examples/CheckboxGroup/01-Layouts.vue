<script setup lang="ts">
import { QCheckbox, QCheckboxGroup, QForm } from 'quiet';

const swatches = [
  { value: 'navy', label: 'Navy', color: 'hsl(222 32% 45%)', count: 6 },
  { value: 'sand', label: 'Sand', color: 'hsl(38 32% 62%)', count: 4 },
  { value: 'olive', label: 'Olive', color: 'hsl(78 30% 50%)', count: 3 },
  { value: 'rust', label: 'Rust', color: 'hsl(16 45% 50%)', count: 0 },
];
</script>

<template>
  <QForm label-placement="top" class="pv">
    <QCheckboxGroup label="Colour" :default-value="['blue', 'sand']" hint="Shown as filters in the shop.">
      <QCheckbox value="blue" label="Blue" meta="24" />
      <QCheckbox value="sand" label="Sand" meta="18" />
      <QCheckbox value="olive" label="Olive" meta="9" />
      <QCheckbox value="rust" label="Rust" meta="0" disabled />
    </QCheckboxGroup>
    <QCheckboxGroup label="Size" layout="inline" :default-value="['M']">
      <QCheckbox v-for="s in ['XS', 'S', 'M', 'L', 'XL']" :key="s" :value="s" :label="s" />
    </QCheckboxGroup>
    <QCheckboxGroup label="Colour (shop filter)" layout="swatches" :default-value="['navy', 'sand']">
      <QCheckbox
        v-for="c in swatches"
        :key="c.value"
        :value="c.value"
        :label="c.label"
        :swatch="c.color"
        :description="`${c.count} products`"
        :disabled="!c.count"
      />
    </QCheckboxGroup>
    <QCheckboxGroup label="Size (shop filter)" layout="buttons" :default-value="['M', 'L']">
      <QCheckbox v-for="s in ['XS', 'S', 'M', 'L', 'XL']" :key="s" :value="s" :label="s" :disabled="s === 'XS'" />
    </QCheckboxGroup>
    <QCheckboxGroup label="Gift options" layout="cards" :default-value="['wrap']">
      <QCheckbox value="wrap" label="Gift wrap" description="Recycled paper, ribbon" meta="3,50 €" />
      <QCheckbox value="card" label="Greeting card" description="Handwritten by our team" meta="2,00 €" />
    </QCheckboxGroup>
  </QForm>
</template>

<style scoped>
.pv { max-width: 480px; }
</style>
