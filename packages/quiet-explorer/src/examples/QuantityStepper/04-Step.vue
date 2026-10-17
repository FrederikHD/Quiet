<!-- step snaps values to packs: napkins are sold in sixes, so 8 becomes 6. -->
<script setup lang="ts">
import { QField, QQuantityStepper } from 'quiet';
import { ref } from 'vue';

const napkins = ref(6);
</script>

<template>
  <QField label="Linen napkins" label-placement="top" hint="Sold in packs of 6.">
    <QQuantityStepper v-model="napkins" :min="6" :max="48" :step="6" />
  </QField>
</template>
