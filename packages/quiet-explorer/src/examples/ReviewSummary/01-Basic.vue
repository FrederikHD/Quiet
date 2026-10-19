<!-- The average, the stars, the count and one bar per star level. -->
<script setup lang="ts">
import { QReviewSummary } from '@frederikhd/quiet';
</script>

<template>
  <QReviewSummary class="summary" :average="4.3" :distribution="{ 5: 20, 4: 7, 3: 2, 2: 0, 1: 2 }" />
</template>

<style scoped>
.summary {
  max-width: 320px;
}
</style>
