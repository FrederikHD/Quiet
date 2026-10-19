<!-- The page number becomes a field: type a number and press Enter. Out-of-range numbers snap to the first or last page. -->
<script setup lang="ts">
import { QPagination } from '@frederikhd/quiet';
import { ref } from 'vue';

const page = ref(12);
</script>

<template>
  <QPagination v-model:page="page" variant="compact" jump-to-page show-first-last :page-size="50" :total="4890" />
</template>
