<!-- When the form sits under its own h2, heading-level="3" keeps the page outline right. -->
<script setup lang="ts">
import { QField, QForm, QFormSection, QInput } from '@frederikhd/quiet';
import { reactive } from 'vue';

const values = reactive({ street: 'Torstraße 12', postcode: '10115', city: 'Berlin' });
</script>

<template>
  <section aria-labelledby="hl-title">
    <h2 id="hl-title" class="title">Order #10421</h2>
    <QForm label-placement="top">
      <QFormSection title="Shipping address" :heading-level="3">
        <QField label="Street and house number"><QInput v-model="values.street" autocomplete="address-line1" /></QField>
        <QField label="Postcode" width="s"><QInput v-model="values.postcode" inputmode="numeric" autocomplete="postal-code" /></QField>
        <QField label="City" width="m"><QInput v-model="values.city" autocomplete="address-level2" /></QField>
      </QFormSection>
    </QForm>
  </section>
</template>

<style scoped>
.title { margin: 0 0 var(--space-4); font: var(--text-title); }
</style>
