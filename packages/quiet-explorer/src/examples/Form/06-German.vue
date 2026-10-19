<!-- strings translates the form's own words: the summary title, "(optional)", "Hilfe" and the "Fehler:" read before each message. -->
<script setup lang="ts">
import { QButton, QField, QForm, QFormActions, QInput, type FormError } from '@frederikhd/quiet';
import { reactive, ref } from 'vue';

const strings = {
  optional: 'optional',
  help: 'Hilfe',
  errorPrefix: 'Fehler:',
  warningPrefix: 'Hinweis:',
  errorSummaryTitle: 'Bitte korrigieren Sie Folgendes',
};
const values = reactive({ name: '', company: '' });
const errors = ref<FormError[]>([]);

function send() {
  errors.value = values.name.trim() ? [] : [{ id: 'de-name', message: 'Geben Sie Ihren Namen ein' }];
}
</script>

<template>
  <QForm label-placement="top" markers="optional" :strings="strings" :errors="errors" @submit.prevent="send">
    <QField id="de-name" label="Name" required :error="errors[0]?.message"
      ><QInput v-model="values.name" autocomplete="name"
    /></QField>
    <QField label="Firma" help="Nur für Geschäftskunden: Die Firma steht dann auf der Rechnung.">
      <QInput v-model="values.company" autocomplete="organization" />
    </QField>
    <QFormActions align="start"><QButton variant="primary" type="submit">Weiter</QButton></QFormActions>
  </QForm>
</template>
