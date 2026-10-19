<!-- Up to two slim actions under the text, for the obvious next step. -->
<script setup lang="ts">
import { QButton, QNotice } from '@frederikhd/quiet';
</script>

<template>
  <QNotice tone="warning" title="3 products are out of stock">
    They’re hidden from the shop until you restock them.
    <template #actions><QButton size="slim" href="#inventory">Open inventory</QButton></template>
  </QNotice>
</template>
