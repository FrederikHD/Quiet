<!-- A required group: send it with nothing ticked to see the error on the group and on every box. -->
<script setup lang="ts">
import { QButton, QCheckbox, QCheckboxGroup, QForm, QFormActions } from '@frederikhd/quiet';
import { computed, ref } from 'vue';

const reasons = ref<string[]>([]);
const tried = ref(false);
const error = computed(() => (tried.value && !reasons.value.length ? 'Choose at least one reason' : null));
</script>

<template>
  <QForm label-placement="top" @submit.prevent="tried = true">
    <QCheckboxGroup v-model="reasons" label="Why are you returning it?" required :error="error">
      <QCheckbox value="size" label="Doesn’t fit" />
      <QCheckbox value="colour" label="Colour differs from the photo" />
      <QCheckbox value="damaged" label="Arrived damaged" />
    </QCheckboxGroup>
    <QFormActions align="start"><QButton variant="primary" type="submit">Continue</QButton></QFormActions>
  </QForm>
</template>
