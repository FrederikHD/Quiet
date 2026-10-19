<!-- size="lg" for reading. Long content scrolls inside the body while the title and the footer stay put. -->
<script setup lang="ts">
import { QButton, QDialog } from '@frederikhd/quiet';
import { ref } from 'vue';

const open = ref(false);
const terms = [
  'Orders placed before 14:00 on a working day leave our warehouse the same day.',
  'Delivery within Germany takes 2–4 working days; to Austria and Switzerland 3–6.',
  'Shipping costs 4,90 € and is free from 59,00 €. Express delivery costs 9,90 € and arrives the next working day.',
  'You can return unworn items within 30 days. Use the label in your parcel; returns are free within Germany.',
  'We refund to the original payment method within 5 working days of receiving your return.',
  'Linen softens with every wash. Small irregularities in the weave are part of the fabric, not a fault.',
  'Gift cards and items from the outlet can’t be returned, but can be exchanged within 14 days.',
  'Parcels to Switzerland may incur customs fees, which the carrier collects on delivery.',
];
</script>

<template>
  <div>
    <QButton variant="ghost" @click="open = true">Shipping terms</QButton>
    <QDialog v-model:open="open" title="Shipping terms" size="lg">
      <ol class="terms">
        <li v-for="t in terms" :key="t">{{ t }}</li>
      </ol>
      <template #footer><QButton variant="primary" @click="open = false">Got it</QButton></template>
    </QDialog>
  </div>
</template>

<style scoped>
.terms { display: grid; gap: var(--space-3); margin: 0; padding-left: var(--space-5); }
</style>
