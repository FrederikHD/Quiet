<!-- Up to three short options side by side. -->
<script setup lang="ts">
import { QRadio, QRadioGroup } from '@frederikhd/quiet';
import { ref } from 'vue';

const fit = ref('regular');
</script>

<template>
  <QRadioGroup v-model="fit" label="Fit" layout="inline" label-placement="top">
    <QRadio value="slim" label="Slim" />
    <QRadio value="regular" label="Regular" />
    <QRadio value="relaxed" label="Relaxed" />
  </QRadioGroup>
</template>
