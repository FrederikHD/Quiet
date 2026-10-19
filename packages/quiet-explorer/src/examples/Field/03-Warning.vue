<!-- A warning allows saving but asks for a second look. The control keeps its normal border. -->
<script setup lang="ts">
import { QField, QInput } from '@frederikhd/quiet';
import { ref } from 'vue';

const stock = ref('4');
</script>

<template>
  <QField label="Stock" label-placement="top" width="s" warning="Below the reorder level of 10">
    <QInput v-model="stock" suffix="pcs" numeric align="end" inputmode="numeric" />
  </QField>
</template>
