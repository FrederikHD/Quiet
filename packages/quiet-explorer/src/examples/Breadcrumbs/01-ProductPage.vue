<!-- Above a product's title: links up the shop's tree, the current page last and not a link. -->
<script setup lang="ts">
import { QBreadcrumbs } from 'quiet';
</script>

<template>
  <QBreadcrumbs
    :items="[
      { label: 'Home', href: '#' },
      { label: 'Women', href: '#women' },
      { label: 'Shirts', href: '#women/shirts' },
      { label: 'Linen shirt, blue' },
    ]"
  />
</template>
