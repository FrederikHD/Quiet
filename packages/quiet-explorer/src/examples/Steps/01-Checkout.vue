<script setup lang="ts">
import { QButton, QSteps } from 'quiet';
import { ref } from 'vue';

const current = ref(1);
const steps = [{ label: 'Address' }, { label: 'Shipping' }, { label: 'Payment' }];
</script>

<template>
  <div class="pv">
    <div>
      <p class="pv-title">Second of three — click "Address" to go back</p>
      <QSteps :steps="steps" :current="current" @select="(i) => (current = i)" />
    </div>
    <div><p class="pv-title">Last step</p><QSteps :steps="steps" :current="2" /></div>
    <div class="narrow"><p class="pv-title">Narrow: only the current label</p><QSteps :steps="steps" :current="1" /></div>
    <div><QButton size="slim" :disabled="current === 2" @click="current = Math.min(2, current + 1)">Next step</QButton></div>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-8); }
.pv-title { margin: 0 0 var(--space-3); font: var(--text-caption); color: var(--ink-muted); }
.narrow { max-width: 340px; }
</style>
