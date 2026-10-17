<!-- The action slot sits under the bars, usually for "Write a review". -->
<script setup lang="ts">
import { QButton, QReviewSummary } from 'quiet';
</script>

<template>
  <QReviewSummary class="summary" :average="4.8" :distribution="{ 5: 92, 4: 20, 3: 4, 2: 1, 1: 1 }">
    <template #action><QButton icon-start="pencil">Write a review</QButton></template>
  </QReviewSummary>
</template>

<style scoped>
.summary { max-width: 320px; }
</style>
