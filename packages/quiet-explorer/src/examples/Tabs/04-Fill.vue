<!-- fill shares the width equally: a segmented choice in a narrow column or on a phone. -->
<script setup lang="ts">
import { QTabs } from 'quiet';
</script>

<template>
  <QTabs
    label="Delivery"
    variant="segmented"
    fill
    class="tabs"
    :tabs="[
      { value: 'ship', label: 'Delivery', icon: 'truck' },
      { value: 'pickup', label: 'Pick up', icon: 'bag' },
    ]"
  >
    <template #panel-ship><p>DHL, 2–3 working days. Free from 75,00 €.</p></template>
    <template #panel-pickup><p>Leinen &amp; Co, Kastanienallee 12, Berlin. Ready in 2 hours.</p></template>
  </QTabs>
</template>

<style scoped>
.tabs { max-width: 360px; }
p { margin: 0; }
</style>
