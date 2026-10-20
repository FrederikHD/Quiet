<!-- Type a number, use ↑ ↓, or tap − and +. Values stay within min and max. -->
<script setup lang="ts">
import { QField, QQuantityStepper } from '@frederikhd/quiet';
import { ref } from 'vue';

const quantity = ref(1);
</script>

<template>
  <QField label="Quantity" label-placement="top" width="xs" hint="Up to 10 per order.">
    <QQuantityStepper v-model="quantity" :min="1" :max="10" />
  </QField>
</template>
