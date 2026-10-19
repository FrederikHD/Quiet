<!-- slim (28px) for filter bars and table cells, default (40px, 32px compact) for forms, large (48px) for storefront search. -->
<script setup lang="ts">
import { QIcon, QInput } from '@frederikhd/quiet';
import { reactive } from 'vue';

const values = reactive({ slim: '', normal: '', large: '' });
</script>

<template>
  <div class="stack">
    <QInput v-model="values.slim" size="slim" aria-label="Filter products" placeholder="Slim">
      <template #prefix><QIcon name="search" /></template>
    </QInput>
    <QInput v-model="values.normal" aria-label="Search orders" placeholder="Default">
      <template #prefix><QIcon name="search" /></template>
    </QInput>
    <QInput v-model="values.large" size="large" aria-label="Search the shop" placeholder="Large">
      <template #prefix><QIcon name="search" /></template>
    </QInput>
  </div>
</template>

<style scoped>
.stack {
  display: grid;
  gap: var(--space-3);
  max-width: 320px;
}
</style>
