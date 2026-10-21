<!-- A long trail wraps onto a second line; a page name too long for a whole line of its own ends in "…". -->
<script setup lang="ts">
import { QBreadcrumbs } from '@frederikhd/quiet';
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
