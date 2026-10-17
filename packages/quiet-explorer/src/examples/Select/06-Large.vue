<!-- size="large" matches the 48px storefront controls on a product page. -->
<script setup lang="ts">
import { QField, QSelect } from 'quiet';
import { ref } from 'vue';

const size = ref('');
</script>

<template>
  <QField label="Size" label-placement="top" width="m">
    <QSelect v-model="size" size="large" placeholder="Select a size" required :options="['S', 'M', 'L', { value: 'XL', label: 'XL — sold out', disabled: true }]" />
  </QField>
</template>
