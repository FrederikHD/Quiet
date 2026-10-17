<!-- Sections split a long form into short, titled parts; a rule separates one from the next. -->
<script setup lang="ts">
import { QField, QForm, QFormSection, QInput } from 'quiet';
import { reactive } from 'vue';

const values = reactive({ title: 'Linen shirt, blue', vendor: 'Leinenweberei Rhön', price: '59,00' });
</script>

<template>
  <QForm label-placement="top">
    <QFormSection title="Product details">
      <QField label="Title" required><QInput v-model="values.title" /></QField>
      <QField label="Vendor" width="m"><QInput v-model="values.vendor" /></QField>
    </QFormSection>
    <QFormSection title="Pricing" description="Prices include VAT.">
      <QField label="Price" width="s" required><QInput v-model="values.price" suffix="€" numeric align="end" inputmode="decimal" /></QField>
    </QFormSection>
  </QForm>
</template>
