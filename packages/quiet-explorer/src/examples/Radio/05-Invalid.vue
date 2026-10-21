<!-- Continue without choosing: while the group has an error, every unchosen circle turns red; choosing one clears it. -->
<script setup lang="ts">
import { QButton, QForm, QFormActions, QRadio, QRadioGroup } from '@frederikhd/quiet';
import { ref } from 'vue';

const amount = ref<string | null>(null);
const tried = ref(false);
</script>

<template>
  <QForm label-placement="top" @submit.prevent="tried = true">
    <QRadioGroup
      v-model="amount"
      label="Gift card amount"
      required
      :error="tried && !amount ? 'Choose an amount' : null"
    >
      <QRadio value="25" label="25,00 €" />
      <QRadio value="50" label="50,00 €" />
      <QRadio value="100" label="100,00 €" />
    </QRadioGroup>
    <QFormActions align="start"><QButton variant="primary" type="submit">Continue</QButton></QFormActions>
  </QForm>
</template>
