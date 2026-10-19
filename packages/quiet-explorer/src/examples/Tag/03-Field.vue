<!-- variant="field": the compact tag for chosen options inside a multi-select, with its own small ×. -->
<script setup lang="ts">
import { QTag } from '@frederikhd/quiet';
import { ref } from 'vue';

const collections = ref(['Summer linen', 'Gifts', 'New in']);
</script>

<template>
  <div class="row">
    <QTag v-for="c in collections" :key="c" variant="field" removable @remove="collections = collections.filter((x) => x !== c)">
      {{ c }}
    </QTag>
  </div>
</template>

<style scoped>
.row { display: flex; flex-wrap: wrap; gap: var(--space-1); }
</style>
