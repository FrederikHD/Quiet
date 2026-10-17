<!-- Read-only for a quantity that is fixed, such as on a shipped order; disabled while it can't be changed. -->
<script setup lang="ts">
import { QField, QForm, QQuantityStepper } from 'quiet';
import { ref } from 'vue';

const shipped = ref(2);
const reserved = ref(1);
</script>

<template>
  <QForm label-placement="top">
    <QField label="Shipped" readonly hint="The order has left the warehouse."><QQuantityStepper v-model="shipped" /></QField>
    <QField label="Reserved" disabled hint="Locked while the payment is pending."><QQuantityStepper v-model="reserved" /></QField>
  </QForm>
</template>
