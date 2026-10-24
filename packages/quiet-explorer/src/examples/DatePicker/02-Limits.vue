<!-- min, max and isDateDisabled rule dates out: no delivery on Sundays, and only within the next six weeks. A typed date that can't be chosen leaves the value null and emits invalid-text, for your message. -->
<script setup lang="ts">
import { QDatePicker, QField } from '@frederikhd/quiet';
import { ref } from 'vue';

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const now = new Date();
const min = iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));
const max = iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 42));
const sunday = (date: string) => new Date(`${date}T12:00:00Z`).getUTCDay() === 0;

const delivery = ref<string | null>(null);
const error = ref<string | null>(null);
const messages = {
  format: 'Enter a date like 24/10/2026',
  range: 'Choose a day within the next six weeks',
  unavailable: 'We don’t deliver on Sundays',
};
</script>

<template>
  <QField label="Delivery date" label-placement="top" width="m" :error="error">
    <QDatePicker
      v-model="delivery"
      :min="min"
      :max="max"
      :is-date-disabled="sunday"
      @update:model-value="error = null"
      @invalid-text="(_text, reason) => (error = messages[reason])"
    />
  </QField>
</template>
