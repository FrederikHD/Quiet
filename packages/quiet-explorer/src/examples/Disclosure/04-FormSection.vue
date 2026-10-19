<!-- A rarely used part of a back-office form folds away, under an h2 and without the divider. -->
<script setup lang="ts">
import { QDisclosure, QField, QForm, QInput, QTextarea } from '@frederikhd/quiet';
import { ref } from 'vue';

const title = ref('Linen shirt, blue – Leinen & Co');
const description = ref('');
</script>

<template>
  <QForm label-placement="top" class="form">
    <QDisclosure title="Search engine listing" meta="Optional" :heading-level="2" :divider="false">
      <QField label="Page title"><QInput v-model="title" /></QField>
      <QField label="Meta description"><QTextarea v-model="description" :rows="3" /></QField>
    </QDisclosure>
  </QForm>
</template>

<style scoped>
.form { max-width: 420px; }
</style>
