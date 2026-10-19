<!-- width fits the control to the expected answer: xs for a house number, s for a postcode, m for a name, l for an email. -->
<script setup lang="ts">
import { QField, QInput } from '@frederikhd/quiet';
import { reactive } from 'vue';

const values = reactive({ number: '12', postcode: '10115', name: 'Anna Schmidt', email: 'anna.schmidt@example.com' });
</script>

<template>
  <div class="stack">
    <QField label="House number" label-placement="top" width="xs"
      ><QInput v-model="values.number" autocomplete="address-line2"
    /></QField>
    <QField label="Postcode" label-placement="top" width="s"
      ><QInput v-model="values.postcode" inputmode="numeric" autocomplete="postal-code"
    /></QField>
    <QField label="Name" label-placement="top" width="m"><QInput v-model="values.name" autocomplete="name" /></QField>
    <QField label="Email" label-placement="top" width="l"
      ><QInput v-model="values.email" type="email" autocomplete="email"
    /></QField>
  </div>
</template>

<style scoped>
.stack {
  display: grid;
  gap: var(--field-gap);
}
</style>
