<!-- Checkout at its second step: Address is done and goes back when chosen, Payment can't be reached yet. Changing step moves focus to the step's heading. -->
<script setup lang="ts">
import { QButton, QSteps } from '@frederikhd/quiet';
import { nextTick, ref } from 'vue';

const current = ref(1);
const steps = [{ label: 'Address' }, { label: 'Shipping' }, { label: 'Payment' }];
const heading = ref<HTMLElement | null>(null);

// The step pressed (or Continue, on the last step) can disappear: focus the new step's heading instead.
async function go(i: number) {
  current.value = i;
  await nextTick();
  heading.value?.focus();
}
</script>

<template>
  <div class="stack">
    <QSteps :steps="steps" :current="current" @select="go" />
    <h3 ref="heading" class="step" tabindex="-1">{{ steps[current].label }}</h3>
    <QButton v-if="current < steps.length - 1" variant="primary" @click="go(current + 1)"
      >Continue to {{ steps[current + 1].label.toLowerCase() }}</QButton
    >
  </div>
</template>

<style scoped>
.stack {
  display: grid;
  justify-items: start;
  gap: var(--space-6);
}
.stack > :first-child {
  justify-self: stretch;
}
.step {
  margin: 0;
  font: var(--text-heading);
}
</style>
