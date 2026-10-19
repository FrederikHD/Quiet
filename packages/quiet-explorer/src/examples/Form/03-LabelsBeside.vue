<!-- label-placement="side" lines the labels up in a column beside the controls, for dense back-office screens. Below 400px they move above. -->
<script setup lang="ts">
import { QField, QForm, QInput } from '@frederikhd/quiet';
import { reactive } from 'vue';

const values = reactive({ title: 'Linen shirt, blue', sku: 'LS-2041-BL-M', price: '59,00' });
</script>

<template>
  <QForm label-placement="side">
    <QField label="Title" required><QInput v-model="values.title" /></QField>
    <QField label="SKU" width="m" hint="Your own article number."><QInput v-model="values.sku" numeric /></QField>
    <QField label="Price" width="s" required><QInput v-model="values.price" suffix="€" numeric align="end" inputmode="decimal" /></QField>
  </QForm>
</template>
