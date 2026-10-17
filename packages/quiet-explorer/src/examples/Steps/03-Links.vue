<!-- With href the finished steps are links back to their own pages. -->
<script setup lang="ts">
import { QSteps } from 'quiet';
</script>

<template>
  <QSteps
    :current="2"
    :steps="[
      { label: 'Address', href: '#checkout/address' },
      { label: 'Shipping', href: '#checkout/shipping' },
      { label: 'Payment', href: '#checkout/payment' },
    ]"
  />
</template>
