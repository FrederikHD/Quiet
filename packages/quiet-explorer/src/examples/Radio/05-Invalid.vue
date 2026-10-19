<!-- While the group has an error, every unchosen circle turns red; choosing one clears it. -->
<script setup lang="ts">
import { QRadio, QRadioGroup } from '@frederikhd/quiet';
import { ref } from 'vue';

const amount = ref<string | null>(null);
</script>

<template>
  <QRadioGroup
    v-model="amount"
    label="Gift card amount"
    label-placement="top"
    required
    :error="amount ? null : 'Choose an amount'"
  >
    <QRadio value="25" label="25,00 €" />
    <QRadio value="50" label="50,00 €" />
    <QRadio value="100" label="100,00 €" />
  </QRadioGroup>
</template>
