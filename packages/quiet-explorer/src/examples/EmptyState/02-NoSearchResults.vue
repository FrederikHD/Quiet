<!-- After a search, name the query in the title and pass role="status" so the change is announced. -->
<script setup lang="ts">
import { QButton, QEmptyState } from 'quiet';
</script>

<template>
  <QEmptyState role="status" title="No results for “lnen”">
    <p>Check the spelling, or try a more general word like “shirt”.</p>
    <template #actions><QButton href="#products">See all products</QButton></template>
  </QEmptyState>
</template>
