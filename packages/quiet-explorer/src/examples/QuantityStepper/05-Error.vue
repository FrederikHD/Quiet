<!-- The Field's error marks the stepper invalid and says what to change. -->
<script setup lang="ts">
import { QField, QQuantityStepper } from 'quiet';
import { ref } from 'vue';

const quantity = ref(5);
</script>

<template>
  <QField label="Quantity" label-placement="top" :error="quantity > 3 ? 'Only 3 left in stock' : null">
    <QQuantityStepper v-model="quantity" :max="9" />
  </QField>
</template>
