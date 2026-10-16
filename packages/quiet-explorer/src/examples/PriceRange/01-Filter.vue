<script setup lang="ts">
import { QPriceRange } from 'quiet';
import { ref } from 'vue';

const range = ref<[number, number]>([30, 90]);
const log = ref('Showing 30 € – 90 €');
</script>

<template>
  <div class="pv">
    <QPriceRange v-model="range" :min="15" :max="115" :step="5" @commit="([a, b]) => (log = `Showing ${a} € – ${b} €`)" />
    <p class="log" role="status">{{ log }}</p>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-4); max-width: 300px; }
.log { margin: 0; min-height: 18px; font: var(--text-small); color: var(--ink-muted); }
</style>
