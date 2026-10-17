<!-- auto-grow grows with the text from rows up to max-rows, then scrolls. -->
<script setup lang="ts">
import { QField, QTextarea } from 'quiet';
import { ref } from 'vue';

const description = ref('Breathable linen from the Rhön, washed for a soft hand. Relaxed fit with a straight hem — wear it tucked or loose.');
</script>

<template>
  <QField label="Description" label-placement="top" hint="Shown on the product page under the price.">
    <QTextarea v-model="description" auto-grow :rows="3" :max-rows="10" />
  </QField>
</template>
