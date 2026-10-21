<!-- One checkbox in a group without a label: it keeps the hint and lines up with the fields around it. A lone checkbox that must be ticked needs no group: Checkbox has its own required and error. -->
<script setup lang="ts">
import { QCheckbox, QCheckboxGroup, QField, QForm, QInput } from '@frederikhd/quiet';
import { ref } from 'vue';

const stock = ref('24');
const track = ref(true);
</script>

<template>
  <QForm label-placement="side">
    <QField label="Stock" width="xs"><QInput v-model="stock" numeric align="end" inputmode="numeric" /></QField>
    <QCheckboxGroup hint="Lowers the stock count when an order ships.">
      <QCheckbox v-model="track" value="track" label="Track inventory" />
    </QCheckboxGroup>
  </QForm>
</template>
