<!-- size="large" has 16px text and 24px lines, to match large inputs in storefront forms. -->
<script setup lang="ts">
import { QField, QTextarea } from 'quiet';
import { ref } from 'vue';

const question = ref('');
</script>

<template>
  <QField label="Your question" label-placement="top" hint="We reply within one working day.">
    <QTextarea v-model="question" size="large" :rows="3" />
  </QField>
</template>
