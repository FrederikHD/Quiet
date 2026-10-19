<!-- Chips mirror the filter panel: removing a chip unticks its option, and ticking an option adds a chip. -->
<script setup lang="ts">
import { QCheckbox, QCheckboxGroup, QFilterChips } from '@frederikhd/quiet';
import { computed, ref } from 'vue';
import { swatchOf } from '../../fixtures/pictures';

const colours = ['Navy', 'Sand', 'Olive', 'Natural'];
const chosen = ref<string[]>(['Navy', 'Olive']);
const chips = computed(() => chosen.value.map((c) => ({ key: c, label: c, swatch: swatchOf(c) })));
</script>

<template>
  <div class="filters">
    <QCheckboxGroup v-model="chosen" label="Colour" layout="swatches" label-placement="top">
      <QCheckbox v-for="c in colours" :key="c" :value="c" :label="c" :swatch="swatchOf(c)" />
    </QCheckboxGroup>
    <QFilterChips :items="chips" @remove="(key) => (chosen = chosen.filter((c) => c !== key))" @clear="chosen = []" />
  </div>
</template>

<style scoped>
.filters {
  display: grid;
  gap: var(--space-4);
}
</style>
