<!-- In the shop: real links that can be bookmarked and crawled, a larger size, centred, without the range. -->
<script setup lang="ts">
import { QPagination } from 'quiet';
import { ref } from 'vue';

const page = ref(3);
</script>

<template>
  <!-- .prevent: the client-side router shows the page instead of following the link. -->
  <QPagination
    v-model:page="page"
    variant="pages"
    size="default"
    align="center"
    :show-range="false"
    :page-size="24"
    :total="230"
    :href-for="(n) => `?page=${n}`"
    @click.prevent
  />
</template>
