<!-- Below 480px the buttons stack full width with the primary on top; checkout uses large buttons. -->
<script setup lang="ts">
import { QButton, QFormActions } from 'quiet';
</script>

<template>
  <QFormActions class="phone">
    <QButton size="large">Back to cart</QButton>
    <QButton variant="primary" size="large" type="submit">Continue to payment</QButton>
  </QFormActions>
</template>

<style scoped>
.phone { max-width: 360px; }
</style>
