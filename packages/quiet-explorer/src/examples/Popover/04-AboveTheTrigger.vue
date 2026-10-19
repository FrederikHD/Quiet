<!-- placement="top" prefers the space above, for a trigger near the bottom of the screen such as a checkout bar. -->
<script setup lang="ts">
import { QButton, QPopover } from '@frederikhd/quiet';
</script>

<template>
  <div class="bar">
    <div class="total">
      Total 64,80 €
      <QPopover
        kind="tip"
        placement="top"
        label="Help: Total"
        content="Includes 19 % VAT (10,35 €) and shipping (4,90 €). No customs fees within the EU."
      >
        <QButton variant="ghost" size="slim" aria-label="Help: Total" icon-start="help" />
      </QPopover>
    </div>
    <QButton variant="primary">Go to checkout</QButton>
  </div>
</template>

<style scoped>
.bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--space-3); }
.total { display: flex; align-items: center; gap: var(--space-1); font-weight: 600; }
</style>
