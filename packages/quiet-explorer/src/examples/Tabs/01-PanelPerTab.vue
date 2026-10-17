<!-- Line tabs over the sections of an order, each with its own panel; a count names what it counts, a disabled tab is skipped. -->
<script setup lang="ts">
import { QTabs } from 'quiet';
</script>

<template>
  <QTabs
    label="Order"
    class="tabs"
    :tabs="[
      { value: 'details', label: 'Details' },
      { value: 'timeline', label: 'Timeline', count: 4, countLabel: '4 events' },
      { value: 'returns', label: 'Returns', disabled: true },
    ]"
  >
    <template #panel-details><p>3 items · Standard shipping to Dresden.</p></template>
    <template #panel-timeline><p>Paid · Confirmation sent · Packed · Label printed</p></template>
    <template #panel-returns />
  </QTabs>
</template>

<style scoped>
.tabs { max-width: 640px; }
p { margin: 0; }
</style>
