<!-- Items without href are buttons: a settings page switching its section in place, named by aria-label. -->
<script setup lang="ts">
import { QNav, type NavItem } from '@frederikhd/quiet';
import { computed, ref } from 'vue';

const section = ref('Payments');
const items = computed<NavItem[]>(() =>
  ['General', 'Payments', 'Shipping', 'Taxes'].map((label) => ({ label, current: section.value === label })),
);
</script>

<template>
  <div class="column">
    <QNav :items="items" aria-label="Settings" @navigate="(item) => (section = item.label)" />
  </div>
</template>

<style scoped>
.column { max-width: 240px; }
</style>
