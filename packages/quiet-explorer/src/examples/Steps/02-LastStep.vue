<!-- On the last step every earlier step shows a check, and screen readers hear "Address (completed)". -->
<script setup lang="ts">
import { QSteps } from '@frederikhd/quiet';
</script>

<template>
  <QSteps :current="2" :steps="[{ label: 'Address' }, { label: 'Shipping' }, { label: 'Payment' }]" />
</template>
