<!-- Units go in the suffix. Numbers are right-aligned with tabular figures so they line up. -->
<script setup lang="ts">
import { QField, QFieldGroup, QForm, QInput } from 'quiet';
import { reactive } from 'vue';

const values = reactive({ price: '59,00', weight: '0,4', stock: '24' });
</script>

<template>
  <QForm label-placement="top">
    <QFieldGroup :columns="[1, 1, 1]" stack="late">
      <QField label="Price"><QInput v-model="values.price" suffix="€" numeric align="end" inputmode="decimal" /></QField>
      <QField label="Weight"><QInput v-model="values.weight" suffix="kg" numeric align="end" inputmode="decimal" /></QField>
      <QField label="Stock"><QInput v-model="values.stock" suffix="pcs" numeric align="end" inputmode="numeric" /></QField>
    </QFieldGroup>
  </QForm>
</template>
