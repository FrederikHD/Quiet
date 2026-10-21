<!-- The back-office navigation: icons, the current page, a count of work waiting, and a titled second section. -->
<script setup lang="ts">
import { QNav, type ItemKey, type NavItem, type NavSection } from '@frederikhd/quiet';
import { computed, ref } from 'vue';

const page = ref<ItemKey>('orders');
const link = (key: string, label: string, extra: Partial<NavItem>): NavItem => ({
  key,
  label,
  href: `#${key}`,
  current: page.value === key,
  ...extra,
});
const sections = computed<NavSection[]>(() => [
  {
    items: [
      link('home', 'Home', { icon: 'home' }),
      link('orders', 'Orders', { icon: 'bag', badge: 12, badgeLabel: '12 to fulfil' }),
      link('products', 'Products', { icon: 'package' }),
      link('customers', 'Customers', { icon: 'user' }),
    ],
  },
  {
    title: 'Shop',
    items: [
      link('online', 'Online store', { icon: 'external-link' }),
      link('settings', 'Settings', { icon: 'sliders' }),
    ],
  },
]);
// A client-side router would route here; links still work when opened in a new tab.
function navigate(item: NavItem, e: MouseEvent) {
  e.preventDefault();
  page.value = item.key ?? 'home';
}
</script>

<template>
  <div class="column">
    <QNav :sections="sections" aria-label="Back office" @navigate="navigate" />
  </div>
</template>

<style scoped>
.column {
  max-width: 280px;
  padding: var(--space-3);
  background: var(--surface-raised);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
}
</style>
