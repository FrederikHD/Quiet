<!-- Short options side by side, wrapping when space runs out; here in a compact back-office table setting. -->
<script setup lang="ts">
import { QCheckbox, QCheckboxGroup, QForm } from 'quiet';
import { ref } from 'vue';

const columns = ref<string[]>(['sku', 'stock']);
</script>

<template>
  <QForm density="compact" label-placement="top">
    <QCheckboxGroup v-model="columns" label="Show columns" layout="inline">
      <QCheckbox value="sku" label="SKU" />
      <QCheckbox value="stock" label="Stock" />
      <QCheckbox value="price" label="Price" />
      <QCheckbox value="vendor" label="Vendor" />
    </QCheckboxGroup>
  </QForm>
</template>
