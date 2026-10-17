<!-- A disabled button is dimmed and can't be clicked; say nearby why it can't be used yet. -->
<script setup lang="ts">
import { QButton } from 'quiet';
</script>

<template>
  <div class="stack">
    <div class="row">
      <QButton disabled>Cancel</QButton>
      <QButton variant="primary" disabled>Refund 59,00 €</QButton>
    </div>
    <p class="why">Refunds open once the return has arrived.</p>
  </div>
</template>

<style scoped>
.stack { display: grid; gap: var(--space-2); }
.row { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.why { margin: 0; font: var(--text-small); color: var(--ink-muted); }
</style>
