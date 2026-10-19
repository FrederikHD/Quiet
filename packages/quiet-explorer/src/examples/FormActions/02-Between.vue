<!-- A destructive action on the left, away from Save; the right-hand pair goes in its own div. -->
<script setup lang="ts">
import { QButton, QFormActions } from '@frederikhd/quiet';
</script>

<template>
  <QFormActions align="between">
    <QButton variant="danger-outline">Delete product</QButton>
    <div class="end">
      <QButton>Cancel</QButton>
      <QButton variant="primary" type="submit">Save</QButton>
    </div>
  </QFormActions>
</template>

<style scoped>
.end {
  display: flex;
  gap: var(--space-2);
}
</style>
