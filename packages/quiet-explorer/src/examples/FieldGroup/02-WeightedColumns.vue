<!-- columns sets relative widths: [3, 1] for Street | House number, [1, 2] for Postcode | City. A row stacks once its narrowest field gets too small. -->
<script setup lang="ts">
import { QField, QFieldGroup, QForm, QInput } from '@frederikhd/quiet';
import { reactive } from 'vue';

const values = reactive({ street: 'Torstraße', number: '12', postcode: '10115', city: 'Berlin' });
</script>

<template>
  <QForm label-placement="top" markers="optional">
    <QFieldGroup :columns="[3, 1]">
      <QField label="Street" required><QInput v-model="values.street" autocomplete="address-line1" /></QField>
      <QField label="House number" required><QInput v-model="values.number" autocomplete="address-line2" /></QField>
    </QFieldGroup>
    <QFieldGroup :columns="[1, 2]">
      <QField label="Postcode" required
        ><QInput v-model="values.postcode" inputmode="numeric" autocomplete="postal-code"
      /></QField>
      <QField label="City" required><QInput v-model="values.city" autocomplete="address-level2" /></QField>
    </QFieldGroup>
  </QForm>
</template>
