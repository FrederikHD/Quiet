<!-- The average, the stars, the count and one bar per star level. -->
<script setup lang="ts">
import { QReviewSummary } from '@frederikhd/quiet';

const distribution = { 5: 20, 4: 7, 3: 2, 2: 0, 1: 2 };
// The average comes from the same counts as the bars, rounded to one decimal: 4.4.
const entries = Object.entries(distribution).map(([stars, n]) => [Number(stars), n]);
const total = entries.reduce((sum, [, n]) => sum + n, 0);
const average = Math.round((entries.reduce((sum, [stars, n]) => sum + stars * n, 0) / total) * 10) / 10;
</script>

<template>
  <QReviewSummary class="summary" :average="average" :distribution="distribution" />
</template>

<style scoped>
.summary {
  max-width: 320px;
}
</style>
