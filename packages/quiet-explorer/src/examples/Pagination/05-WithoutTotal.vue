<!-- Cursor-based APIs don't know the total: leave it out and say whether there is a next page. -->
<script setup lang="ts">
import { QPagination } from 'quiet';
import { ref } from 'vue';

const page = ref(1);
</script>

<template>
  <QPagination v-model:page="page" :page-size="25" :has-next="page < 4" />
</template>
