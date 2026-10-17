<!-- A description adds one muted line under the label; meta puts the price at the end of the row. -->
<script setup lang="ts">
import { QRadio, QRadioGroup } from 'quiet';
import { ref } from 'vue';

const ship = ref('std');
</script>

<template>
  <QRadioGroup v-model="ship" label="Delivery" label-placement="top" class="narrow">
    <QRadio value="std" label="Standard" description="2–4 working days" meta="Free" />
    <QRadio value="exp" label="Express" description="Next working day" meta="9,90 €" />
    <QRadio value="pick" label="Pick up in store" description="Berlin, Torstraße 115" meta="Free" />
  </QRadioGroup>
</template>

<style scoped>
.narrow { max-width: 420px; }
</style>
