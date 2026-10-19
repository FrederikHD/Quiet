<!-- Limit the countries to where you deliver; with none chosen yet, the select asks for one. -->
<script setup lang="ts">
import { QAddressFields, QForm, type Address } from '@frederikhd/quiet';
import { ref } from 'vue';

const countries = [
  { value: 'DE', label: 'Germany' },
  { value: 'AT', label: 'Austria' },
  { value: 'CH', label: 'Switzerland' },
];
const address = ref<Address>({});
</script>

<template>
  <QForm label-placement="top" class="address">
    <QAddressFields v-model="address" id-prefix="dach" :countries="countries" country-placeholder="Choose a country" />
  </QForm>
</template>

<style scoped>
.address { max-width: 560px; }
</style>
