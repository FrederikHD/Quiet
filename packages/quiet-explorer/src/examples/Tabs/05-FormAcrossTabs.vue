<!-- One Form around the tabs and one Save below them. Save with the email empty: the tab gets a marker and the summary link opens it. -->
<script setup lang="ts">
import { QButton, QField, QForm, QFormActions, QInput, QTabs, type FormError } from '@frederikhd/quiet';
import { reactive, ref } from 'vue';

const v = reactive({ name: 'Leinen & Co', email: '' });
const errors = ref<FormError[] | null>(null);
const err = (id: string) => errors.value?.find((x) => x.id === id)?.message ?? null;
function save() {
  const list: FormError[] = [];
  if (!v.name.trim()) list.push({ id: 'store-name', message: 'Enter the store name' });
  if (!/.+@.+\..+/.test(v.email))
    list.push({ id: 'store-email', message: 'Enter an email address like name@example.com' });
  errors.value = list.length ? list : null;
}
</script>

<template>
  <QForm label-placement="top" :errors="errors" class="form" @submit.prevent="save">
    <QTabs
      label="Settings sections"
      :panel-focusable="false"
      :tabs="[
        { value: 'store', label: 'Store' },
        { value: 'contact', label: 'Contact' },
      ]"
    >
      <template #panel-store>
        <QField id="store-name" label="Store name" required :error="err('store-name')"
          ><QInput v-model="v.name"
        /></QField>
      </template>
      <template #panel-contact>
        <QField id="store-email" label="Contact email" required :error="err('store-email')"
          ><QInput v-model="v.email" type="email" autocomplete="email"
        /></QField>
      </template>
    </QTabs>
    <QFormActions><QButton variant="primary" type="submit">Save</QButton></QFormActions>
  </QForm>
</template>

<style scoped>
.form {
  max-width: 640px;
}
</style>
