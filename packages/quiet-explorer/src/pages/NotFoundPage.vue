<script setup lang="ts">
import { QButton, QEmptyState, QPage } from 'quiet';
</script>

<template>
  <QPage title="Not found">
    <QEmptyState title="There's no page here" icon="search" :heading-level="2">
      <p>The link may be old. Pick a component on the left, or start from the brand book.</p>
      <template #actions><QButton href="/">Brand book</QButton></template>
    </QEmptyState>
  </QPage>
</template>
