<!-- density="compact" gives 32px controls and tighter gaps for back-office screens with many fields. -->
<script setup lang="ts">
import { QField, QFieldGroup, QForm, QInput } from '@frederikhd/quiet';
import { reactive } from 'vue';

const values = reactive({ stock: '24', reorder: '10', location: 'Regal B · Fach 12' });
</script>

<template>
  <QForm label-placement="top" density="compact">
    <QFieldGroup>
      <QField label="In stock"><QInput v-model="values.stock" suffix="pcs" numeric align="end" inputmode="numeric" /></QField>
      <QField label="Reorder level"><QInput v-model="values.reorder" suffix="pcs" numeric align="end" inputmode="numeric" /></QField>
    </QFieldGroup>
    <QField label="Storage location" width="m"><QInput v-model="values.location" /></QField>
  </QForm>
</template>
