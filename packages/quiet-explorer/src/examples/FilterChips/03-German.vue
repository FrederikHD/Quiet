<!-- strings translates the group name, the chip buttons ("Filter entfernen: Leinen") and Clear all. -->
<script setup lang="ts">
import { QFilterChips } from '@frederikhd/quiet';
import { ref } from 'vue';

const strings = {
  label: 'Aktive Filter',
  remove: (label: string) => `Filter entfernen: ${label}`,
  clear: 'Alle löschen',
};
const filters = ref([
  { key: 'material', label: 'Leinen' },
  { key: 'size', label: 'Größe M' },
  { key: 'stock', label: 'Auf Lager' },
]);
</script>

<template>
  <QFilterChips
    :items="filters"
    :strings="strings"
    @remove="(key) => (filters = filters.filter((f) => f.key !== key))"
    @clear="filters = []"
  />
</template>
