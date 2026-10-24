<!-- Sizes like Input, and the read-only and disabled states. A read-only date has no calendar button. -->
<script setup lang="ts">
import { QDatePicker, QField } from '@frederikhd/quiet';
import { ref } from 'vue';

const date = ref<string | null>('2026-10-24');
</script>

<template>
  <div style="display: grid; gap: var(--space-4); max-width: 320px">
    <QField label="Slim" label-placement="top"><QDatePicker v-model="date" size="slim" /></QField>
    <QField label="Large" label-placement="top"><QDatePicker v-model="date" size="large" /></QField>
    <QField label="Read-only" label-placement="top"><QDatePicker v-model="date" readonly /></QField>
    <QField label="Disabled" label-placement="top"><QDatePicker v-model="date" disabled /></QField>
  </div>
</template>
