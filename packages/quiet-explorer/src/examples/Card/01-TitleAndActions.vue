<!-- A titled card groups one topic; slim ghost actions sit on the title line. -->
<script setup lang="ts">
import { QButton, QCard } from '@frederikhd/quiet';
</script>

<template>
  <QCard title="Customer" class="card">
    <template #actions><QButton size="slim" variant="ghost">Edit</QButton></template>
    <div>
      <div>Anna Schmidt</div>
      <div class="muted">anna@example.com · 4 orders</div>
    </div>
  </QCard>
</template>

<style scoped>
.card { max-width: 400px; }
.muted { font: var(--text-small); color: var(--ink-muted); }
</style>
