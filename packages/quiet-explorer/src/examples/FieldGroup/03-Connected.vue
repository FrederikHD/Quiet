<!-- connected joins parts that make one value into a single control. Each part keeps its own label. -->
<script setup lang="ts">
import { QField, QFieldGroup, QForm, QInput } from '@frederikhd/quiet';
import { reactive } from 'vue';

const values = reactive({ prefix: 'ORD-', next: '01050' });
</script>

<template>
  <QForm label-placement="top">
    <QFieldGroup :columns="[1, 3]" connected :hint="`The next order will be ${values.prefix}${values.next}.`">
      <QField label="Prefix"><QInput v-model="values.prefix" /></QField>
      <QField label="Next number"><QInput v-model="values.next" numeric align="end" /></QField>
    </QFieldGroup>
  </QForm>
</template>
