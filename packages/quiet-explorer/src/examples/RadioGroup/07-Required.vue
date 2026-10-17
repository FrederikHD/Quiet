<!-- Continue without choosing: unchosen options turn red and the message shows under the group. -->
<script setup lang="ts">
import { QButton, QForm, QFormActions, QRadio, QRadioGroup } from 'quiet';
import { ref } from 'vue';

const reason = ref<string | null>(null);
const tried = ref(false);
</script>

<template>
  <QForm label-placement="top" @submit.prevent="tried = true">
    <QRadioGroup v-model="reason" label="Return reason" required :error="tried && !reason ? 'Choose a reason' : null">
      <QRadio value="size" label="Doesn’t fit" />
      <QRadio value="damaged" label="Arrived damaged" />
      <QRadio value="other" label="Something else" />
    </QRadioGroup>
    <QFormActions align="start"><QButton variant="primary" type="submit">Continue</QButton></QFormActions>
  </QForm>
</template>
