<!-- Disabled while the results load: the handles and fields stay readable but can't be moved. -->
<script setup lang="ts">
import { QPriceRange } from '@frederikhd/quiet';
import { ref } from 'vue';

const range = ref<[number, number]>([30, 90]);
</script>

<template>
  <QPriceRange v-model="range" :min="15" :max="115" :step="5" disabled class="range" />
</template>

<style scoped>
.range {
  max-width: 300px;
}
</style>
