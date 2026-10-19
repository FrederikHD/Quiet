<!-- A static list people can search: typing filters it, ignoring case and accents. Each option can carry a meta value. -->
<script setup lang="ts">
import { QCombobox, QField, type ComboboxOption } from '@frederikhd/quiet';
import { ref } from 'vue';

const rate = ref<ComboboxOption | null>(null);
const rates: ComboboxOption[] = [
  { value: 'de19', label: 'Germany, standard', meta: '19%' },
  { value: 'de7', label: 'Germany, reduced', meta: '7%' },
  { value: 'at20', label: 'Austria, standard', meta: '20%' },
  { value: 'at10', label: 'Austria, reduced', meta: '10%' },
  { value: 'ch81', label: 'Switzerland, standard', meta: '8.1%' },
  { value: 'ch26', label: 'Switzerland, reduced', meta: '2.6%' },
  { value: 'none', label: 'Tax exempt', meta: '0%' },
];
</script>

<template>
  <QField label="Tax rate" label-placement="top" width="l">
    <QCombobox v-model="rate" placeholder="Choose a rate" :options="rates" clearable />
  </QField>
</template>
