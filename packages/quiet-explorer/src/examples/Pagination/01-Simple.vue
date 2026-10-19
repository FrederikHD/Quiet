<!-- The default: the range, rows per page, previous and next. It sits in a Table's footer. -->
<script setup lang="ts">
import { QPagination } from '@frederikhd/quiet';
import { ref } from 'vue';

const page = ref(1);
const size = ref(50);
</script>

<template>
  <QPagination
    v-model:page="page"
    v-model:page-size="size"
    :total="1240"
    :page-size-options="[25, 50, 100]"
    @update:page-size="page = 1"
  />
</template>
