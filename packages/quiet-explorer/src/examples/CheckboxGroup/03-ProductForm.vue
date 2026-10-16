<script setup lang="ts">
import { QButton, QCheckbox, QCheckboxGroup, QField, QForm, QFormActions, QInput } from 'quiet';
import { computed, ref } from 'vue';

// Labels beside from 400px; a single checkbox without a group label; save with no channel to see the error.
const title = ref('Linen shirt, blue');
const channels = ref<string[]>([]);
const notify = ref<string[]>(['email']);
const track = ref(true);
const tried = ref(false);
const error = computed(() => (tried.value && channels.value.length === 0 ? 'Choose at least one sales channel' : null));
</script>

<template>
  <QForm label-placement="side" :errors="error ? [{ id: 'cg-channels', message: error }] : null" class="pv" @submit.prevent="tried = true">
    <QField label="Product title" required><QInput v-model="title" /></QField>
    <QCheckboxGroup id="cg-channels" v-model="channels" label="Sell on" required layout="cards" :columns="2" :error="error">
      <QCheckbox value="web" label="Online store" description="shop.example.com" />
      <QCheckbox value="pos" label="Point of sale" description="3 stores" />
      <QCheckbox value="market" label="Marketplaces" description="Zalando, Amazon" meta="+5%" />
    </QCheckboxGroup>
    <QCheckboxGroup v-model="notify" label="Notify the customer by" help="Only for this order. Customers set their defaults in their account.">
      <QCheckbox value="email" label="Email" description="Order confirmation and shipping updates" />
      <QCheckbox value="sms" label="Text message" description="Only when the parcel is out for delivery" />
    </QCheckboxGroup>
    <QCheckboxGroup hint="Changes the stock count when the order ships.">
      <QCheckbox v-model="track" value="track" label="Track inventory" />
    </QCheckboxGroup>
    <QFormActions><QButton variant="primary" type="submit">Save product</QButton></QFormActions>
  </QForm>
</template>

<style scoped>
.pv { max-width: 720px; }
</style>
