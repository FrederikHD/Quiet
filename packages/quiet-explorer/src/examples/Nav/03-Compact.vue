<!-- In compact density each item is 32px tall, so more of a long navigation fits. -->
<script setup lang="ts">
import { QNav, type NavItem } from 'quiet';

const items: NavItem[] = [
  { label: 'Home', href: '#home', icon: 'home' },
  { label: 'Orders', href: '#orders', icon: 'bag', badge: 12, badgeLabel: '12 to fulfil', current: true },
  { label: 'Products', href: '#products', icon: 'package' },
  { label: 'Customers', href: '#customers', icon: 'user' },
  { label: 'Discounts', href: '#discounts', icon: 'percent', badge: 2, badgeLabel: '2 ending this week' },
];
</script>

<template>
  <div class="column" data-density="compact">
    <QNav :items="items" aria-label="Compact navigation" />
  </div>
</template>

<style scoped>
.column { max-width: 280px; padding: var(--space-3); background: var(--surface-raised); border: 1px solid var(--line); border-radius: var(--radius-lg); }
</style>
