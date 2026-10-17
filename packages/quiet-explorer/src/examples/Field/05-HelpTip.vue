<!-- help adds a tip button after the label for background people may want; anything they need to answer goes in the hint. -->
<script setup lang="ts">
import { QField, QInput } from 'quiet';
import { ref } from 'vue';

const sku = ref('LS-2041-BL-M');
</script>

<template>
  <QField
    label="SKU"
    label-placement="top"
    width="m"
    help="Your own article number. It appears on packing slips and invoices, not in the shop."
    hint="Letters, digits and hyphens."
  >
    <QInput v-model="sku" numeric />
  </QField>
</template>
