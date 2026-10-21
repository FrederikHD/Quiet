<!-- The action slot sits under the bars, usually for "Write a review". -->
<script setup lang="ts">
import { QButton, QReviewSummary } from '@frederikhd/quiet';
import { ref } from 'vue';

const distribution = { 5: 92, 4: 20, 3: 4, 2: 1, 1: 1 };
// The average comes from the same counts as the bars, rounded to one decimal: 4.7.
const entries = Object.entries(distribution).map(([stars, n]) => [Number(stars), n]);
const total = entries.reduce((sum, [, n]) => sum + n, 0);
const average = Math.round((entries.reduce((sum, [stars, n]) => sum + stars * n, 0) / total) * 10) / 10;
const log = ref('');
</script>

<template>
  <div class="stack">
    <QReviewSummary class="summary" :average="average" :distribution="distribution">
      <template #action>
        <QButton icon-start="pencil" @click="log = 'Opened the review form'">Write a review</QButton>
      </template>
    </QReviewSummary>
    <p class="log" role="status">{{ log }}</p>
  </div>
</template>

<style scoped>
.stack {
  display: grid;
  gap: var(--space-3);
}
.summary {
  max-width: 320px;
}
.log {
  margin: 0;
  min-height: 18px;
  font: var(--text-small);
  color: var(--ink-muted);
}
</style>
