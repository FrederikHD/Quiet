<!-- size="small" inside a section of a page, with the heading one level below the section's. -->
<script setup lang="ts">
import { QButton, QCard, QEmptyState } from '@frederikhd/quiet';
</script>

<template>
  <QCard title="Reviews">
    <QEmptyState size="small" icon="star" :heading-level="3" title="No reviews yet">
      <p>Bought this shirt? Tell others how it fits and wears.</p>
      <template #actions><QButton icon-start="pencil">Write the first review</QButton></template>
    </QEmptyState>
  </QCard>
</template>
