<script setup lang="ts">
// Five stars, part-filled for fractions (4.6). Decorative: the number and words carry the meaning.
import { STAR_PATH } from './stars';

defineProps<{ value: number }>();
const fill = (value: number, i: number) => Math.max(0, Math.min(1, value - i));
</script>

<template>
  <span class="q-stars" aria-hidden="true">
    <span v-for="i in 5" :key="i" class="q-star">
      <svg viewBox="0 0 20 20" class="q-star__base"><path :d="STAR_PATH" /></svg>
      <span v-if="fill(value, i - 1) > 0" class="q-star__fill" :style="{ width: `${fill(value, i - 1) * 100}%` }">
        <svg viewBox="0 0 20 20"><path :d="STAR_PATH" /></svg>
      </span>
    </span>
  </span>
</template>
