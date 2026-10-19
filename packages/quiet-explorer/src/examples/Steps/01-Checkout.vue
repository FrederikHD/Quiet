<!-- Checkout at its second step: Address is done and goes back when chosen, Payment can't be reached yet. -->
<script setup lang="ts">
import { QButton, QSteps } from '@frederikhd/quiet';
import { ref } from 'vue';

const current = ref(1);
const steps = [{ label: 'Address' }, { label: 'Shipping' }, { label: 'Payment' }];
</script>

<template>
  <div class="stack">
    <QSteps :steps="steps" :current="current" @select="(i) => (current = i)" />
    <QButton v-if="current < steps.length - 1" variant="primary" @click="current++">Continue to {{ steps[current + 1].label.toLowerCase() }}</QButton>
  </div>
</template>

<style scoped>
.stack { display: grid; justify-items: start; gap: var(--space-6); }
.stack > :first-child { justify-self: stretch; }
</style>
