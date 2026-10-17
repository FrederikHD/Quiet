<!-- Numbered pages with gaps, first and last; align="between" puts the range on the left. Under 560px it shows "4 / 25". -->
<script setup lang="ts">
import { QPagination } from 'quiet';
import { ref } from 'vue';

const page = ref(4);
</script>

<template>
  <QPagination v-model:page="page" variant="pages" show-first-last align="between" :page-size="25" :total="612" />
</template>
