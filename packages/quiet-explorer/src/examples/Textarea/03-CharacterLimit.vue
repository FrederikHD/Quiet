<!-- maxlength adds a counter; near the limit it changes to "8 characters left". -->
<script setup lang="ts">
import { QField, QTextarea } from 'quiet';
import { ref } from 'vue';

const message = ref('Alles Gute zum Geburtstag, Lea! Viel Freude mit dem');
</script>

<template>
  <QField label="Gift message" label-placement="top" hint="Printed on the card.">
    <QTextarea v-model="message" :rows="2" :maxlength="60" />
  </QField>
</template>
