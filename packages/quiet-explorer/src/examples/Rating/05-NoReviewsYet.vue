<!-- Without reviews it says so; as a link it invites the first one. -->
<script setup lang="ts">
import { QRating } from '@frederikhd/quiet';
import { ref } from 'vue';

const log = ref('');
</script>

<template>
  <div><QRating :value="0" :count="0" @click="log = 'Opened the review form'" /></div>
  <p class="log" role="status">{{ log }}</p>
</template>

<style scoped>
.log { margin: 0; min-height: 18px; font: var(--text-small); color: var(--ink-muted); }
</style>
