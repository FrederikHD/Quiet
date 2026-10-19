<!-- In a cards group each Radio is a tile; the media slot adds a decorative icon before the label. -->
<script setup lang="ts">
import { QIcon, QRadio, QRadioGroup } from '@frederikhd/quiet';
import { ref } from 'vue';

const pay = ref('card');
</script>

<template>
  <QRadioGroup v-model="pay" label="Payment" layout="cards" label-placement="top" class="narrow">
    <QRadio value="card" label="Card" description="Debit or credit card">
      <template #media><QIcon name="credit-card" /></template>
    </QRadio>
    <QRadio value="invoice" label="Invoice" description="Pay within 14 days">
      <template #media><QIcon name="mail" /></template>
    </QRadio>
  </QRadioGroup>
</template>

<style scoped>
.narrow {
  max-width: 420px;
}
</style>
