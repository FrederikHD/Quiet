<!-- label-placement="side" puts the label beside the control when the field is at least 400px wide; messages stay under the control. -->
<script setup lang="ts">
import { QField, QInput } from '@frederikhd/quiet';
import { reactive } from 'vue';

const values = reactive({ title: 'Linen shirt, blue', price: '' });
</script>

<template>
  <div class="stack">
    <QField
      label="Product title"
      required
      label-placement="side"
      hint="Shown on the product page and in search results."
    >
      <QInput v-model="values.title" />
    </QField>
    <QField
      label="Price"
      required
      label-placement="side"
      width="s"
      error="Enter a price, like 49,90"
      help="The price customers pay, including VAT."
    >
      <QInput v-model="values.price" suffix="€" numeric align="end" inputmode="decimal" />
    </QField>
  </div>
</template>

<style scoped>
.stack {
  display: grid;
  gap: var(--field-gap);
}
</style>
