<!-- size="large" (48px) in the storefront header and on phones. Without suggestions, Enter simply searches. -->
<script setup lang="ts">
import { QSearchBox } from '@frederikhd/quiet';
import { ref } from 'vue';

const q = ref('');
const searched = ref('');
</script>

<template>
  <div class="stack">
    <QSearchBox
      v-model="q"
      size="large"
      label="Search the shop"
      placeholder="Search Leinen & Co"
      @submit="(query) => (searched = `Searched for “${query}”`)"
    />
    <p class="log" role="status">{{ searched }}</p>
  </div>
</template>

<style scoped>
.stack {
  display: grid;
  gap: var(--space-3);
  max-width: 520px;
}
.log {
  margin: 0;
  min-height: 18px;
  font: var(--text-small);
  color: var(--ink-muted);
}
</style>
