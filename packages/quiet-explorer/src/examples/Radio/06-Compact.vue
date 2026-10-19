<!-- In compact density the circle is 16px and the rows 32px tall, for dense back-office screens. -->
<script setup lang="ts">
import { QForm, QRadio, QRadioGroup } from '@frederikhd/quiet';
import { ref } from 'vue';

const format = ref('csv');
</script>

<template>
  <QForm density="compact" label-placement="top">
    <QRadioGroup v-model="format" label="Export orders as" layout="inline">
      <QRadio value="csv" label="CSV" />
      <QRadio value="xlsx" label="Excel" />
      <QRadio value="pdf" label="PDF" disabled />
    </QRadioGroup>
  </QForm>
</template>
