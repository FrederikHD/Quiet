<!-- A notice that appears after an action sits in a role="status" region that is already on the page, so it is announced. -->
<script setup lang="ts">
import { QButton, QNotice } from '@frederikhd/quiet';
import { ref } from 'vue';

const saved = ref(false);
</script>

<template>
  <div class="stack">
    <div role="status">
      <QNotice v-if="saved" tone="success" title="Shipping settings saved"
        >They apply to orders placed from now on.</QNotice
      >
    </div>
    <QButton variant="primary" @click="saved = true">Save settings</QButton>
  </div>
</template>

<style scoped>
.stack {
  display: grid;
  justify-items: start;
  gap: var(--space-3);
}
.stack > [role='status'] {
  justify-self: stretch;
}
/* Empty, the region stays in the page (so it is announced when it fills) but takes no room in the grid. */
.stack > [role='status']:empty {
  margin-bottom: calc(-1 * var(--space-3));
}
</style>
