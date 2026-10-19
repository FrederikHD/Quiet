<!-- Bordered tiles with a description and a price, for delivery in checkout. Left empty: the choice is the customer's. -->
<script setup lang="ts">
import { QRadio, QRadioGroup } from '@frederikhd/quiet';
import { ref } from 'vue';

const ship = ref<string | null>(null);
</script>

<template>
  <QRadioGroup v-model="ship" label="Delivery" layout="cards" label-placement="top" required class="narrow">
    <QRadio value="std" label="Standard" description="2–4 working days" meta="Free" />
    <QRadio value="exp" label="Express" description="Next working day" meta="9,90 €" />
    <QRadio value="pick" label="Pick up in store" description="Berlin, Torstraße 115 · ready in 2 hours" meta="Free" />
  </QRadioGroup>
</template>

<style scoped>
.narrow {
  max-width: 480px;
}
</style>
