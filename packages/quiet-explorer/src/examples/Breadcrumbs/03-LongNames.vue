<!-- A long page name ends in "…" instead of pushing the trail onto a second line. -->
<script setup lang="ts">
import { QBreadcrumbs } from 'quiet';
</script>

<template>
  <QBreadcrumbs
    :items="[
      { label: 'Home', href: '#' },
      { label: 'Home and living', href: '#home-living' },
      { label: 'Linen tablecloth, stone-washed, with hemstitch border, 160 × 250 cm' },
    ]"
  />
</template>
