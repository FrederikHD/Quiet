<!-- validateAddress checks missing parts, the postcode's shape and the house number. Press Continue empty. -->
<script setup lang="ts">
import { QAddressFields, QButton, QForm, QFormActions, QFormSection, validateAddress, type Address } from 'quiet';
import { computed, ref } from 'vue';

const address = ref<Address>({ country: 'DE', line1: 'Torstraße', postalCode: '1011' });
const tried = ref(false);
const check = computed(() => validateAddress(address.value, { idPrefix: 'ship' }));
</script>

<template>
  <QForm label-placement="top" :errors="tried ? check.list : null" class="address" @submit.prevent="tried = true">
    <QFormSection title="Delivery address">
      <QAddressFields v-model="address" id-prefix="ship" :errors="tried ? check.errors : {}" />
    </QFormSection>
    <QFormActions align="start"><QButton type="submit" variant="primary">Continue</QButton></QFormActions>
  </QForm>
</template>

<style scoped>
.address { max-width: 560px; }
</style>
