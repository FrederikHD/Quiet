<!-- A Textarea for longer text, four lines high by default. People can drag the corner to make it taller. -->
<script setup lang="ts">
import { QField, QTextarea } from 'quiet';
import { ref } from 'vue';

const note = ref('');
</script>

<template>
  <QField label="Order note" label-placement="top" hint="Only your team sees this.">
    <QTextarea v-model="note" placeholder="e.g. Customer asked for gift wrapping" />
  </QField>
</template>
