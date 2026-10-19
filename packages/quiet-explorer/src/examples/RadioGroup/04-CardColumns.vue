<!-- columns puts several cards in a row; in compact density they suit back-office settings. -->
<script setup lang="ts">
import { QForm, QRadio, QRadioGroup } from '@frederikhd/quiet';
import { ref } from 'vue';

const tax = ref('incl');
</script>

<template>
  <QForm density="compact" label-placement="top">
    <QRadioGroup v-model="tax" label="Tax" layout="cards" :columns="2">
      <QRadio value="incl" label="Prices include tax" description="Usual for shops in the EU" />
      <QRadio value="excl" label="Prices exclude tax" description="Tax is added at checkout" />
    </QRadioGroup>
  </QForm>
</template>
