<!-- A label, the control and a hint that stays visible. Required fields get an asterisk and aria-required. -->
<script setup lang="ts">
import { QField, QInput } from '@frederikhd/quiet';
import { ref } from 'vue';

const email = ref('');
</script>

<template>
  <QField label="Email" required label-placement="top" width="l" hint="We send the order confirmation here.">
    <QInput v-model="email" type="email" autocomplete="email" placeholder="name@example.com" />
  </QField>
</template>
