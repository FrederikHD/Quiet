<!-- currency changes the symbol in the fields and the amounts the handles read out, for the Swiss shop. -->
<script setup lang="ts">
import { QPriceRange } from '@frederikhd/quiet';
import { ref } from 'vue';

const range = ref<[number, number]>([40, 150]);
</script>

<template>
  <QPriceRange v-model="range" :min="20" :max="200" :step="10" currency="CHF" class="range" />
</template>

<style scoped>
.range { max-width: 300px; }
</style>
