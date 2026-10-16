<script setup lang="ts">
import { QBreadcrumbs } from 'quiet';

const trail = [
  { label: 'Home', href: '#' },
  { label: 'Women', href: '#women' },
  { label: 'Shirts', href: '#shirts' },
  { label: 'Linen shirt, relaxed fit with mother-of-pearl buttons' },
];
</script>

<template>
  <div class="pv">
    <div>
      <p class="pv-title">Wide</p>
      <QBreadcrumbs :items="trail" />
    </div>
    <div class="narrow">
      <p class="pv-title">Narrow (under 480px of its own width)</p>
      <QBreadcrumbs :items="trail" />
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-6); }
.pv-title { margin: 0 0 var(--space-2); font: var(--text-caption); color: var(--ink-muted); }
.narrow { max-width: 320px; }
</style>
