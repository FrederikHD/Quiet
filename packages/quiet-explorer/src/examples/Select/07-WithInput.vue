<!-- Connected to an Input in a FieldGroup, for an amount and its currency. -->
<script setup lang="ts">
import { QField, QFieldGroup, QForm, QInput, QSelect } from 'quiet';
import { reactive } from 'vue';

const values = reactive({ amount: '120,00', currency: 'EUR' });
</script>

<template>
  <QForm label-placement="top">
    <QFieldGroup label="Gift card value" :columns="[3, 1]" connected>
      <QField label="Amount" label-hidden><QInput v-model="values.amount" numeric align="end" inputmode="decimal" /></QField>
      <QField label="Currency" label-hidden><QSelect v-model="values.currency" :options="['EUR', 'CHF', 'GBP']" /></QField>
    </QFieldGroup>
  </QForm>
</template>
