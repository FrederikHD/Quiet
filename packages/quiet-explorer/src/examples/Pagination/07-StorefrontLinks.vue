<!-- In the shop: real links that can be bookmarked and crawled, the large size, centred, without the range. -->
<script setup lang="ts">
import { QPagination } from '@frederikhd/quiet';
import { ref } from 'vue';

const page = ref(3);

// A plain click stays in the page: the client-side router shows it instead of following the link.
// Ctrl-, ⌘-, Shift- and middle clicks keep their usual meaning (a new tab or window).
function onClick(e: MouseEvent) {
  const plain = e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
  if (plain && (e.target as Element).closest('a[href]')) e.preventDefault();
}
</script>

<template>
  <QPagination
    v-model:page="page"
    variant="pages"
    size="large"
    align="center"
    :show-range="false"
    :page-size="24"
    :total="230"
    :href-for="(n) => `?page=${n}`"
    @click="onClick"
  />
</template>
