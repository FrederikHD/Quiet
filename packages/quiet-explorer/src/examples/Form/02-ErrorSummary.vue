<!-- Save the empty form: the summary at the top lists each error and links to its field, and focus moves to it. -->
<script setup lang="ts">
import { QButton, QField, QForm, QFormActions, QInput, type FormError } from 'quiet';
import { reactive, ref } from 'vue';

const values = reactive({ title: '', price: '' });
const errors = ref<FormError[]>([]);
const errorOf = (id: string) => errors.value.find((e) => e.id === id)?.message;

function save() {
  errors.value = [];
  if (!values.title.trim()) errors.value.push({ id: 'es-title', message: 'Enter a product title' });
  if (!values.price.trim()) errors.value.push({ id: 'es-price', message: 'Enter a price, like 49,90' });
}
</script>

<template>
  <QForm label-placement="top" :errors="errors" @submit.prevent="save">
    <QField id="es-title" label="Title" required :error="errorOf('es-title')">
      <QInput v-model="values.title" placeholder="e.g. Linen shirt, blue" />
    </QField>
    <QField id="es-price" label="Price" width="s" required :error="errorOf('es-price')">
      <QInput v-model="values.price" suffix="€" numeric align="end" inputmode="decimal" />
    </QField>
    <QFormActions align="start"><QButton variant="primary" type="submit">Save</QButton></QFormActions>
  </QForm>
</template>
