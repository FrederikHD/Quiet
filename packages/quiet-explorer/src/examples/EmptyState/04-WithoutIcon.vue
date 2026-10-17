<!-- :icon="null" for a quiet, expected empty state, such as a dashboard card early in the day. -->
<script setup lang="ts">
import { QCard, QEmptyState } from 'quiet';
</script>

<template>
  <QCard title="Today’s orders">
    <QEmptyState size="small" :icon="null" :heading-level="3" title="No orders yet today">
      <p>New orders show up here as they come in.</p>
    </QEmptyState>
  </QCard>
</template>
