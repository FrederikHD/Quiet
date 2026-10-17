<!-- In compact density the box is 16px and the row 32px high, for back-office filters. -->
<script setup lang="ts">
import { QCheckbox } from 'quiet';
import { reactive } from 'vue';

const filters = reactive({ lowStock: true, archived: false });
</script>

<template>
  <div class="list" data-density="compact">
    <QCheckbox v-model="filters.lowStock" label="Only low stock" meta="12" />
    <QCheckbox v-model="filters.archived" label="Show archived products" meta="48" />
  </div>
</template>

<style scoped>
.list { display: grid; max-width: 320px; }
</style>
