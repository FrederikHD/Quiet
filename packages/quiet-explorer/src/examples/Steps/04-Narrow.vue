<!-- Under 520px of its own width only the current step keeps its label; the others are numbered or checked circles. -->
<script setup lang="ts">
import { QSteps } from '@frederikhd/quiet';
</script>

<template>
  <div class="narrow">
    <QSteps :current="1" :steps="[{ label: 'Address' }, { label: 'Shipping' }, { label: 'Payment' }, { label: 'Review' }]" />
  </div>
</template>

<style scoped>
.narrow { max-width: 340px; }
</style>
