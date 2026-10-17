<!-- In checkout most fields are required, so markers="optional" marks the few that aren't instead. -->
<script setup lang="ts">
import { QField, QForm, QInput } from 'quiet';
import { reactive } from 'vue';

const values = reactive({ email: '', phone: '', company: '' });
</script>

<template>
  <QForm label-placement="top" markers="optional">
    <QField label="Email" required width="l" hint="We send the order confirmation here.">
      <QInput v-model="values.email" type="email" autocomplete="email" />
    </QField>
    <QField label="Phone" width="m" hint="For delivery questions only.">
      <QInput v-model="values.phone" type="tel" autocomplete="tel" />
    </QField>
    <QField label="Company" width="l"><QInput v-model="values.company" autocomplete="organization" /></QField>
  </QForm>
</template>
