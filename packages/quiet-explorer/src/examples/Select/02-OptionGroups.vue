<!-- Groups put the most common choices first. On a required Select the placeholder can't be picked again. Press Continue with no country. -->
<script setup lang="ts">
import { QButton, QField, QForm, QFormActions, QSelect } from 'quiet';
import { ref } from 'vue';

const countries = [
  { label: 'Most common', options: ['Germany', 'Austria', 'Switzerland'] },
  { label: 'All countries', options: ['Belgium', 'Denmark', 'France', 'Italy', 'Netherlands', 'Poland', 'Spain'] },
];
const country = ref('');
const tried = ref(false);
</script>

<template>
  <QForm label-placement="top" @submit.prevent="tried = true">
    <QField label="Country" required width="m" :error="tried && !country ? 'Choose the country we deliver to' : null">
      <QSelect v-model="country" placeholder="Choose a country" :options="countries" autocomplete="country-name" />
    </QField>
    <QFormActions align="start"><QButton variant="primary" type="submit">Continue</QButton></QFormActions>
  </QForm>
</template>
