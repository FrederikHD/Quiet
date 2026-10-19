<!-- With href the button is a link, for navigation; disabled, it can't be focused or followed. -->
<script setup lang="ts">
import { QButton } from '@frederikhd/quiet';
</script>

<template>
  <div class="row">
    <QButton href="#orders/10530" icon-end="arrow-right">View order</QButton>
    <QButton href="#orders/10530/invoice" icon-start="download" disabled>Download invoice</QButton>
  </div>
</template>

<style scoped>
.row { display: flex; flex-wrap: wrap; gap: var(--space-2); }
</style>
