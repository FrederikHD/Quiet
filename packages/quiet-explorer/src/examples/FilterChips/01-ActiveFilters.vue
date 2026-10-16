<script setup lang="ts">
import { QButton, QFilterChips } from 'quiet';
import { ref } from 'vue';

const ALL = [
  { key: 'navy', label: 'Navy', swatch: 'hsl(222 32% 45%)' },
  { key: 'sand', label: 'Sand', swatch: 'hsl(38 32% 62%)' },
  { key: 'm', label: 'Size M' },
  { key: 'p', label: '30 € – 90 €' },
  { key: 'stock', label: 'In stock' },
];
const items = ref([...ALL]);
</script>

<template>
  <div class="pv">
    <QFilterChips :items="items" @remove="(key) => (items = items.filter((x) => x.key !== key))" @clear="items = []" />
    <div><QButton size="slim" @click="items = [...ALL]">Reset example</QButton></div>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-4); }
</style>
