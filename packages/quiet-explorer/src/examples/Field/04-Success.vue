<!-- Success confirms a check that ran and passed, such as an address lookup. -->
<script setup lang="ts">
import { QField, QInput } from '@frederikhd/quiet';
import { ref } from 'vue';

const postcode = ref('10115');
</script>

<template>
  <QField label="Postcode" label-placement="top" width="s" success="Address found: 10115 Berlin">
    <QInput v-model="postcode" numeric inputmode="numeric" autocomplete="postal-code" />
  </QField>
</template>
