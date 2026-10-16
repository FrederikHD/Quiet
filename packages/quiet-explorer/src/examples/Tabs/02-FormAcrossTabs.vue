<script setup lang="ts">
import { QButton, QField, QForm, QFormActions, QInput, QTabs, type FormError } from 'quiet';
import { reactive, ref } from 'vue';

// Save with the email empty: the tab gets a marker and the summary link opens it.
const v = reactive({ name: 'Leinen & Co', email: '' });
const errors = ref<FormError[] | null>(null);
const err = (id: string) => errors.value?.find((x) => x.id === id)?.message ?? null;
function save() {
  const list: FormError[] = [];
  if (!v.name.trim()) list.push({ id: 'pv-name', message: 'Enter the store name' });
  if (!/.+@.+\..+/.test(v.email)) list.push({ id: 'pv-email', message: 'Enter an email address like name@example.com' });
  errors.value = list.length ? list : null;
}
</script>

<template>
  <QForm label-placement="top" :errors="errors" class="box" @submit.prevent="save">
    <QTabs
      label="Settings sections"
      :tabs="[
        { value: 'store', label: 'Store' },
        { value: 'contact', label: 'Contact' },
        { value: 'tax', label: 'Taxes' },
      ]"
    >
      <template #panel-store>
        <QField id="pv-name" label="Store name" required :error="err('pv-name')"><QInput v-model="v.name" /></QField>
      </template>
      <template #panel-contact>
        <QField id="pv-email" label="Contact email" required :error="err('pv-email')"><QInput v-model="v.email" type="email" autocomplete="email" /></QField>
      </template>
      <template #panel-tax><p>Prices include VAT.</p></template>
    </QTabs>
    <QFormActions><QButton variant="primary" type="submit">Save</QButton></QFormActions>
  </QForm>
</template>

<style scoped>
.box { max-width: 640px; }
p { margin: 0; }
</style>
