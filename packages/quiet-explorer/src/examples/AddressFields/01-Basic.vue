<!-- A delivery address laid out the way Germany writes it, with autocomplete tokens for one-tap browser filling. -->
<script setup lang="ts">
import { QAddressFields, QForm, type Address } from '@frederikhd/quiet';
import { ref } from 'vue';

const address = ref<Address>({ country: 'DE' });
</script>

<template>
  <QForm label-placement="top" class="address">
    <QAddressFields v-model="address" id-prefix="basic" />
  </QForm>
</template>

<style scoped>
.address { max-width: 560px; }
</style>
