<!-- Read-only values can still be selected and copied. Disabled ones can't, so the hint says why. -->
<script setup lang="ts">
import { QField, QInput } from '@frederikhd/quiet';
import { reactive } from 'vue';

const values = reactive({ order: 'ORD-2026-01049', vat: '' });
</script>

<template>
  <div class="stack">
    <QField label="Order number" label-placement="top" width="m" readonly hint="Quote it in emails to customer service.">
      <QInput v-model="values.order" numeric />
    </QField>
    <QField label="Company VAT ID" label-placement="top" width="m" disabled hint="Only for business accounts.">
      <QInput v-model="values.vat" placeholder="DE123456789" />
    </QField>
  </div>
</template>

<style scoped>
.stack { display: grid; gap: var(--field-gap); }
</style>
