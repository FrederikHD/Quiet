<!-- Items with href are links: they go somewhere instead of doing something. -->
<script setup lang="ts">
import { QButton, QMenu } from 'quiet';
</script>

<template>
  <QMenu
    label="View"
    align="start"
    :items="[
      { label: 'Product page in the shop', icon: 'external-link', href: '#shop/linen-shirt-blue' },
      { label: 'Sales report', icon: 'list', href: '#reports/linen-shirt-blue' },
      { label: 'Reviews', icon: 'star', href: '#reviews/linen-shirt-blue' },
    ]"
  >
    <template #trigger><QButton icon-end="chevron-down">View</QButton></template>
  </QMenu>
</template>
