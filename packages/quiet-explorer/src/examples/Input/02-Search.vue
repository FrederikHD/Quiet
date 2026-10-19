<!-- A search icon in the prefix slot and a clear button while there is a value. The purpose is obvious, so an aria-label replaces the visible label. -->
<script setup lang="ts">
import { QIcon, QInput } from '@frederikhd/quiet';
import { ref } from 'vue';

const query = ref('#1049');
</script>

<template>
  <QInput v-model="query" class="search" aria-label="Search orders" placeholder="Search orders" clearable>
    <template #prefix><QIcon name="search" /></template>
  </QInput>
</template>

<style scoped>
.search {
  max-width: 320px;
}
</style>
