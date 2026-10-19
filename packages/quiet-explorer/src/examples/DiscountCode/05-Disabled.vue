<!-- Disabled while the payment is processed: applied codes stay, but can't be removed or added. -->
<script setup lang="ts">
import { QDiscountCode } from '@frederikhd/quiet';
</script>

<template>
  <QDiscountCode disabled :applied="[{ code: 'LINEN10', label: '−10 %' }]" :apply="() => {}" class="discount" />
</template>

<style scoped>
.discount {
  max-width: 420px;
}
</style>
