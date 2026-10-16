<script setup lang="ts">
import { QButton, QReviewSummary } from 'quiet';
import { ref } from 'vue';

const only = ref<number | null>(null);
</script>

<template>
  <div class="pv">
    <QReviewSummary :average="4.3" :distribution="{ 5: 20, 4: 7, 3: 2, 2: 0, 1: 2 }" filterable :active="only" @filter="only = $event">
      <template #action><QButton icon-start="pencil">Write a review</QButton></template>
    </QReviewSummary>
    <p class="log" role="status">{{ only ? `Showing ${only}-star reviews` : 'Showing all reviews' }}</p>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-4); max-width: 320px; }
.log { margin: 0; min-height: 18px; font: var(--text-small); color: var(--ink-muted); }
</style>
