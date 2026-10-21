<!-- multiple picks several values; they show as tags in the box, and the panel stays open while you pick (Escape, a click outside or Tab closes it; Done on phones). -->
<script setup lang="ts">
import { QCombobox, QField, type ComboboxOption } from '@frederikhd/quiet';
import { ref } from 'vue';

const countries: ComboboxOption[] = [
  'Austria',
  'Belgium',
  'Czechia',
  'Denmark',
  'France',
  'Germany',
  'Italy',
  'Luxembourg',
  'Netherlands',
  'Poland',
  'Spain',
  'Sweden',
  'Switzerland',
].map((c) => ({ value: c, label: c }));
const shipsTo = ref<ComboboxOption[]>(countries.filter((c) => ['Germany', 'Austria', 'Switzerland'].includes(c.label)));
</script>

<template>
  <QField label="Ships to" label-placement="top" width="l" hint="Customers in other countries can't check out.">
    <QCombobox v-model="shipsTo" multiple placeholder="Add countries" :options="countries" name="countries" />
  </QField>
</template>
