<!-- disabled while the next page loads: the controls rest and aria-busy is set. -->
<script setup lang="ts">
import { QPagination } from '@frederikhd/quiet';
import { ref, watch } from 'vue';

const page = ref(1);
const loading = ref(false);
// Each page comes from the server.
watch(page, () => {
  loading.value = true;
  setTimeout(() => (loading.value = false), 600);
});
</script>

<template>
  <QPagination v-model:page="page" variant="pages" :page-size="25" :total="612" :disabled="loading" />
</template>
