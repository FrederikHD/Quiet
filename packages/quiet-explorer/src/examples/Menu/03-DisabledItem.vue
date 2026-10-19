<!-- An item that can't be used right now stays in place, dimmed, and says why. -->
<script setup lang="ts">
import { QMenu } from '@frederikhd/quiet';
</script>

<template>
  <div class="row">
    <span>Order #10528 · Shipped</span>
    <QMenu
      label="Actions for order #10528"
      :items="[
        { label: 'Track parcel', icon: 'truck', href: '#orders/10528/tracking' },
        { label: 'Edit shipping address', icon: 'pencil', disabled: true, description: 'Locked once shipped' },
      ]"
    />
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  max-width: 420px;
  padding: var(--space-2) var(--space-2) var(--space-2) var(--space-4);
  background: var(--surface-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
}
</style>
