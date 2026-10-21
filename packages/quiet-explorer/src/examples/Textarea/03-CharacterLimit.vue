<!-- maxlength adds a counter ("31 / 60"); near the limit it changes to "8 characters left". Keep typing to see it. -->
<script setup lang="ts">
import { QField, QTextarea } from '@frederikhd/quiet';
import { ref } from 'vue';

const message = ref('Alles Gute zum Geburtstag, Lea!');
</script>

<template>
  <QField label="Gift message" label-placement="top" hint="Printed on the card.">
    <QTextarea v-model="message" :rows="2" :maxlength="60" />
  </QField>
</template>
