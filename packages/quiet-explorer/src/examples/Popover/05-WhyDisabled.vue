<!-- A disabled button can't explain itself, so a tip next to it says what is missing. -->
<script setup lang="ts">
import { QButton, QPopover } from '@frederikhd/quiet';
</script>

<template>
  <div class="row">
    <QButton variant="primary" disabled>Publish product</QButton>
    <QPopover kind="tip" label="Why can’t I publish?" content="Add at least one photo and a price, then “Linen shirt, blue” can go live.">
      <QButton variant="ghost" icon-start="help">Why can’t I publish?</QButton>
    </QPopover>
  </div>
</template>

<style scoped>
.row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); }
</style>
