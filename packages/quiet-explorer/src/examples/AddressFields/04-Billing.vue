<!-- A billing address: billing autocomplete tokens, and the phone field left out with fields. -->
<script setup lang="ts">
import { QAddressFields, QForm, type Address } from 'quiet';
import { ref } from 'vue';

const billing = ref<Address>({ country: 'AT', company: 'Leinenhaus GmbH' });
</script>

<template>
  <QForm label-placement="top" class="address">
    <QAddressFields v-model="billing" id-prefix="bill" kind="billing" :fields="{ phone: 'hidden' }" />
  </QForm>
</template>

<style scoped>
.address { max-width: 560px; }
</style>
