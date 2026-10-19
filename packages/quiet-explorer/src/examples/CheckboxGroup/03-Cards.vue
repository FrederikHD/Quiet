<!-- Bordered tiles with a description and a price: extras the customer adds to an order. -->
<script setup lang="ts">
import { QCheckbox, QCheckboxGroup } from '@frederikhd/quiet';
import { ref } from 'vue';

const extras = ref<string[]>(['wrap']);
</script>

<template>
  <QCheckboxGroup v-model="extras" label="Gift options" layout="cards" label-placement="top" class="gift">
    <QCheckbox value="wrap" label="Gift wrap" description="Recycled paper, linen ribbon" meta="3,50 €" />
    <QCheckbox value="card" label="Greeting card" description="Handwritten by our team" meta="2,00 €" />
  </QCheckboxGroup>
</template>

<style scoped>
.gift { max-width: 480px; }
</style>
