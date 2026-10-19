<!-- A Select and an Input connected under one group label. The part labels are hidden but still read out. -->
<script setup lang="ts">
import { QField, QFieldGroup, QForm, QInput, QSelect } from '@frederikhd/quiet';
import { reactive } from 'vue';

const values = reactive({ dial: '+49', phone: '30 901820' });
const dialCodes = [
  {
    label: 'Most common',
    options: [
      { value: '+49', label: 'DE +49' },
      { value: '+43', label: 'AT +43' },
      { value: '+41', label: 'CH +41' },
    ],
  },
  {
    label: 'Other countries',
    options: [
      { value: '+32', label: 'BE +32' },
      { value: '+33', label: 'FR +33' },
      { value: '+31', label: 'NL +31' },
      { value: '+48', label: 'PL +48' },
    ],
  },
];
</script>

<template>
  <QForm label-placement="top">
    <QFieldGroup label="Phone" :columns="[1, 3]" connected required hint="For delivery questions only.">
      <QField label="Country code" label-hidden
        ><QSelect v-model="values.dial" :options="dialCodes" autocomplete="tel-country-code"
      /></QField>
      <QField label="Phone number" label-hidden
        ><QInput v-model="values.phone" inputmode="tel" autocomplete="tel-national"
      /></QField>
    </QFieldGroup>
  </QForm>
</template>
