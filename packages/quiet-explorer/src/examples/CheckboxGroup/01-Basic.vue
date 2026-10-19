<!-- A question with several independent answers: tick any number of them, or none. -->
<script setup lang="ts">
import { QCheckbox, QCheckboxGroup } from '@frederikhd/quiet';
import { ref } from 'vue';

const notify = ref<string[]>(['email']);
</script>

<template>
  <QCheckboxGroup
    v-model="notify"
    label="Notify the customer by"
    hint="Only for this order. Customers set their defaults in their account."
  >
    <QCheckbox value="email" label="Email" description="Order confirmation and shipping updates" />
    <QCheckbox value="sms" label="Text message" description="Only when the parcel is out for delivery" />
  </QCheckboxGroup>
</template>
