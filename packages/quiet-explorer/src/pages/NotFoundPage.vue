<script setup lang="ts">
import { QButton, QEmptyState, QPage } from '@frederikhd/quiet';
import { useRouter } from 'vue-router';

// Through the router, so the link keeps the site's base path (/Quiet/, /Quiet/next/) and a plain click stays in the app.
const router = useRouter();
const home = router.resolve('/').href;
function goHome(e: MouseEvent) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  e.preventDefault();
  void router.push('/');
}
</script>

<template>
  <QPage title="Not found">
    <QEmptyState title="There's no page here" icon="search" :heading-level="2">
      <p>The link may be old. Pick a component from the navigation, or start from the brand book.</p>
      <template #actions><QButton :href="home" @click="goHome">Brand book</QButton></template>
    </QEmptyState>
  </QPage>
</template>
