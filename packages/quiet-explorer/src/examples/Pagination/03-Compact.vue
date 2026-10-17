<!-- "6 / 25" between the arrows, for side panels and dialogs. -->
<script setup lang="ts">
import { QPagination } from 'quiet';
import { ref } from 'vue';

const page = ref(6);
</script>

<template>
  <QPagination v-model:page="page" variant="compact" :show-range="false" :page-size="10" :total="248" />
</template>
