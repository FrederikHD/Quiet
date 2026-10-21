<!-- Choosing another country changes the layout: the US has City, then State and ZIP code. -->
<script setup lang="ts">
import { QAddressFields, QForm, type Address } from '@frederikhd/quiet';
import { ref } from 'vue';

const address = ref<Address>({ country: 'US' });
</script>

<template>
  <QForm label-placement="top" class="address">
    <QAddressFields v-model="address" id-prefix="us" />
  </QForm>
</template>

<style scoped>
.address {
  max-width: 560px;
}
</style>
