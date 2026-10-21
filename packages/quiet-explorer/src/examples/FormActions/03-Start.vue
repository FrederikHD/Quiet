<!-- A single action on the left, under a short top-labelled form such as the newsletter sign-up. -->
<script setup lang="ts">
import { QButton, QField, QForm, QFormActions, QInput } from '@frederikhd/quiet';
import { ref } from 'vue';

const email = ref('');
const done = ref(false);
</script>

<template>
  <QForm label-placement="top" class="signup" @submit.prevent="done = true">
    <QField label="Email" hint="About once a month: new linen, no spam.">
      <QInput v-model="email" type="email" autocomplete="email" size="large" />
    </QField>
    <QFormActions align="start"><QButton variant="primary" size="large" type="submit">Subscribe</QButton></QFormActions>
    <p class="done" role="status">{{ done ? 'Thanks! Please confirm the email we just sent.' : '' }}</p>
  </QForm>
</template>

<style scoped>
.signup {
  max-width: 520px;
}
.done {
  margin: 0;
  font: var(--text-small);
  color: var(--success);
}
</style>
