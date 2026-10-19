<!-- PageColumns inside one Form, when fields sit in both columns: one error summary and one Save. Save with the title empty. -->
<script setup lang="ts">
import {
  QButton,
  QCard,
  QField,
  QForm,
  QFormActions,
  QInput,
  QPage,
  QPageColumns,
  QSelect,
  type FormError,
} from '@frederikhd/quiet';
import { reactive, ref } from 'vue';

const v = reactive({ title: '', price: '59,00', status: 'Draft' });
const errors = ref<FormError[] | null>(null);
function save() {
  errors.value = v.title.trim() ? null : [{ id: 'product-title', message: 'Enter a product title' }];
}
</script>

<template>
  <div class="frame">
    <QPage title="New product" :back="{ href: '#products', label: 'Products' }">
      <QForm label-placement="top" :errors="errors" @submit.prevent="save">
        <QPageColumns>
          <QCard title="Details">
            <QField id="product-title" label="Title" required :error="errors?.[0]?.message">
              <QInput v-model="v.title" placeholder="e.g. Linen shirt, blue" />
            </QField>
            <QField label="Price"><QInput v-model="v.price" suffix="€" align="end" numeric /></QField>
          </QCard>
          <template #aside>
            <QCard title="Status">
              <QField label="Status" label-hidden><QSelect v-model="v.status" :options="['Active', 'Draft']" /></QField>
            </QCard>
          </template>
        </QPageColumns>
        <QFormActions>
          <QButton>Cancel</QButton>
          <QButton variant="primary" type="submit">Save product</QButton>
        </QFormActions>
      </QForm>
    </QPage>
  </div>
</template>

<style scoped>
.frame {
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--surface);
}
</style>
