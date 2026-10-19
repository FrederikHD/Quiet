<!-- stack="late" keeps rows of short values, like length × width × height, in one row down to phone width. -->
<script setup lang="ts">
import { QField, QFieldGroup, QForm, QInput } from '@frederikhd/quiet';
import { reactive } from 'vue';

const values = reactive({ length: '30', width: '22', height: '4' });
</script>

<template>
  <QForm label-placement="side" density="compact">
    <QFieldGroup label="Dimensions" hint="Packed size, used for shipping rates." :columns="[1, 1, 1]" stack="late">
      <QField label="Length"
        ><QInput v-model="values.length" suffix="cm" numeric align="end" inputmode="decimal"
      /></QField>
      <QField label="Width"
        ><QInput v-model="values.width" suffix="cm" numeric align="end" inputmode="decimal"
      /></QField>
      <QField label="Height"
        ><QInput v-model="values.height" suffix="cm" numeric align="end" inputmode="decimal"
      /></QField>
    </QFieldGroup>
  </QForm>
</template>
