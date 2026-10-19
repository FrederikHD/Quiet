<!-- meta puts a price or count at the end of the row, right-aligned with tabular figures. -->
<script setup lang="ts">
import { QCheckbox } from '@frederikhd/quiet';
import { reactive } from 'vue';

const extras = reactive({ wrap: false, card: true });
</script>

<template>
  <div class="list">
    <QCheckbox v-model="extras.wrap" label="Gift wrapping" meta="3,50 €" />
    <QCheckbox v-model="extras.card" label="Greeting card" description="Written by hand with your message." meta="2,00 €" />
  </div>
</template>

<style scoped>
.list { display: grid; max-width: 420px; }
</style>
