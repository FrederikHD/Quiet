<!-- A Select in a Field for one choice from a short, known list. Options can be strings or { value, label }. -->
<script setup lang="ts">
import { QField, QSelect } from '@frederikhd/quiet';
import { ref } from 'vue';

const shipping = ref('standard');
const methods = [
  { value: 'standard', label: 'Standard, free' },
  { value: 'express', label: 'Express, 9,90 €' },
  { value: 'pickup', label: 'Store pickup' },
];
</script>

<template>
  <QField
    label="Shipping method"
    label-placement="top"
    width="l"
    hint="Express arrives the next working day if ordered before 14:00."
  >
    <QSelect v-model="shipping" :options="methods" />
  </QField>
</template>
