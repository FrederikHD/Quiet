<!-- With an error, read-only and disabled. -->
<script setup lang="ts">
import { QField, QForm, QTextarea } from '@frederikhd/quiet';
import { reactive } from 'vue';

const values = reactive({
  reason: '',
  note: 'Gift — please leave out the invoice.',
  internal: 'Pack in tissue paper.',
});
</script>

<template>
  <QForm label-placement="top">
    <QField label="Reason for the refund" required error="Tell the customer why — at least a few words">
      <QTextarea v-model="values.reason" :rows="3" />
    </QField>
    <QField label="Customer note" readonly><QTextarea v-model="values.note" :rows="2" /></QField>
    <QField label="Internal note" disabled hint="Locked while the order ships."
      ><QTextarea v-model="values.internal" :rows="2"
    /></QField>
  </QForm>
</template>
