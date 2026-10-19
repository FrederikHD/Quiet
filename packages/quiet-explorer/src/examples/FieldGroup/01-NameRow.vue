<!-- Two short parts of one answer side by side, in equal columns. They stay side by side down to phone width. -->
<script setup lang="ts">
import { QField, QFieldGroup, QForm, QInput } from '@frederikhd/quiet';
import { reactive } from 'vue';

const values = reactive({ first: 'Anna', last: 'Schmidt' });
</script>

<template>
  <QForm label-placement="top">
    <QFieldGroup>
      <QField label="First name" required><QInput v-model="values.first" autocomplete="given-name" /></QField>
      <QField label="Last name" required><QInput v-model="values.last" autocomplete="family-name" /></QField>
    </QFieldGroup>
  </QForm>
</template>
