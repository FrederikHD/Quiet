<!-- Type a date in the shop's format, or pick one from the calendar. The value is an ISO date: "2026-10-24". -->
<script setup lang="ts">
import { QDatePicker, QField } from '@frederikhd/quiet';
import { ref } from 'vue';

const published = ref<string | null>('2026-10-24');
</script>

<template>
  <QField label="Publish on" label-placement="top" width="m" :hint="`Value: ${published ?? 'null'}`">
    <QDatePicker v-model="published" clearable />
  </QField>
</template>
