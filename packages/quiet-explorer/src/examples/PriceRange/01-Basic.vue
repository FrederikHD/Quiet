<!-- Drag the handles or type the amounts; the filter applies on commit, when a handle is let go or a field is left. -->
<script setup lang="ts">
import { QPriceRange } from '@frederikhd/quiet';
import { ref } from 'vue';

const range = ref<[number, number]>([30, 90]);
const shown = ref<[number, number]>([30, 90]);
</script>

<template>
  <div class="filter">
    <QPriceRange v-model="range" :min="15" :max="115" :step="5" @commit="shown = $event" />
    <p class="result" role="status">Showing linen from {{ shown[0] }} € to {{ shown[1] }} €</p>
  </div>
</template>

<style scoped>
.filter { display: grid; gap: var(--space-4); max-width: 300px; }
.result { margin: 0; font: var(--text-small); color: var(--ink-muted); }
</style>
