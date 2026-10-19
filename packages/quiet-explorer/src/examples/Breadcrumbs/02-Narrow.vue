<!-- Under 480px of its own width only the parent is left, as "← Shirts": the step people want on a phone. -->
<script setup lang="ts">
import { QBreadcrumbs } from '@frederikhd/quiet';
</script>

<template>
  <div class="narrow">
    <QBreadcrumbs
      :items="[
        { label: 'Home', href: '#' },
        { label: 'Women', href: '#women' },
        { label: 'Shirts', href: '#women/shirts' },
        { label: 'Linen shirt, blue' },
      ]"
    />
  </div>
</template>

<style scoped>
.narrow { max-width: 320px; }
</style>
