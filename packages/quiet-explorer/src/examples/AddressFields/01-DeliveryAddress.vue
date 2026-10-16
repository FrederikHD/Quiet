<script setup lang="ts">
import { QAddressFields, QButton, QForm, QFormActions, QFormSection, validateAddress, type Address } from 'quiet';
import { computed, ref } from 'vue';

const address = ref<Address>({ country: 'DE' });
const tried = ref(false);
const log = ref('');
const check = computed(() => validateAddress(address.value, { idPrefix: 'ship' }));

function submit() {
  tried.value = true;
  log.value = check.value.valid ? 'Address OK' : '';
}
</script>

<template>
  <div class="pv">
    <QForm label-placement="top" :errors="tried ? check.list : null" @submit.prevent="submit">
      <QFormSection title="Delivery address">
        <QAddressFields v-model="address" id-prefix="ship" :errors="tried ? check.errors : {}" @change="log = ''" />
      </QFormSection>
      <QFormActions align="start"><QButton type="submit" variant="primary">Continue</QButton></QFormActions>
      <p class="pv-log" role="status">{{ log }}</p>
    </QForm>
  </div>
</template>

<style scoped>
.pv { max-width: 560px; }
.pv-log { margin: 0; min-height: 18px; font: var(--text-small); color: var(--success); }
</style>
