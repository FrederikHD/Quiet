<!-- A lone required checkbox carries its own required and error, no group needed. Press Place order without ticking it. -->
<script setup lang="ts">
import { QButton, QCheckbox, QForm, QFormActions } from '@frederikhd/quiet';
import { ref } from 'vue';

const terms = ref(false);
const tried = ref(false);
</script>

<template>
  <QForm label-placement="top" @submit.prevent="tried = true">
    <QCheckbox
      id="terms"
      v-model="terms"
      name="terms"
      label="I accept the terms and the cancellation policy"
      required
      :error="tried && !terms ? 'Accept the terms to place your order' : null"
    />
    <QFormActions align="start"><QButton variant="primary" type="submit">Place order</QButton></QFormActions>
  </QForm>
</template>
