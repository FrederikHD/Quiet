<!-- kind="tip" explains a term in a sentence or two. It opens on click or tap, and focus stays on the button. -->
<script setup lang="ts">
import { QButton, QPopover } from '@frederikhd/quiet';
</script>

<template>
  <div class="line">
    Shipping: 4,90 €
    <QPopover
      kind="tip"
      label="Help: Shipping"
      content="Free within Germany from 59,00 €. Express delivery costs 9,90 € and arrives the next working day."
    >
      <QButton variant="ghost" size="slim" aria-label="Help: Shipping" icon-start="help" />
    </QPopover>
  </div>
</template>

<style scoped>
.line {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
</style>
