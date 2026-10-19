<!-- Under the product title it leads to the reviews: href for another page, @click to open them on this one. -->
<script setup lang="ts">
import { QRating } from '@frederikhd/quiet';
import { ref } from 'vue';

const log = ref('');
</script>

<template>
  <div><QRating :value="4.3" :count="31" @click="log = 'Opened the reviews tab'" /></div>
  <p class="log" role="status">{{ log }}</p>
</template>

<style scoped>
.log {
  margin: 0;
  min-height: 18px;
  font: var(--text-small);
  color: var(--ink-muted);
}
</style>
