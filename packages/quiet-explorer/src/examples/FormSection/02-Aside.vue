<!-- layout="aside" puts the heading and description beside the fields once the section is 760px wide — for settings pages. -->
<script setup lang="ts">
import { QField, QFieldGroup, QForm, QFormSection, QInput } from '@frederikhd/quiet';
import { reactive } from 'vue';

const values = reactive({ name: 'Leinen & Co.', email: 'hallo@leinen.example', prefix: 'ORD-', next: '01050' });
</script>

<template>
  <QForm label-placement="top" density="compact">
    <QFormSection title="Store details" description="Shown in the shop footer and on invoices." layout="aside">
      <QField label="Store name" required><QInput v-model="values.name" /></QField>
      <QField label="Support email" required hint="Customers reply to this address."
        ><QInput v-model="values.email" type="email"
      /></QField>
    </QFormSection>
    <QFormSection title="Order numbers" description="How new order numbers start." layout="aside">
      <QFieldGroup :columns="[1, 3]" connected :hint="`The next order will be ${values.prefix}${values.next}.`">
        <QField label="Prefix"><QInput v-model="values.prefix" /></QField>
        <QField label="Next number"><QInput v-model="values.next" numeric align="end" /></QField>
      </QFieldGroup>
    </QFormSection>
  </QForm>
</template>
