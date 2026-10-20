<!-- Sub-pages show under their parent while it or one of them is current; the parent's icon turns brand. -->
<script setup lang="ts">
import { QNav, type ItemKey, type NavItem } from '@frederikhd/quiet';
import { computed, ref } from 'vue';

const page = ref<ItemKey>('inventory');
const link = (key: string, label: string, extra: Partial<NavItem> = {}): NavItem => ({
  key,
  label,
  href: `#${key}`,
  current: page.value === key,
  ...extra,
});
const items = computed(() => [
  link('orders', 'Orders', { icon: 'bag' }),
  link('products', 'Products', {
    icon: 'package',
    items: [link('collections', 'Collections'), link('inventory', 'Inventory'), link('gift-cards', 'Gift cards')],
  }),
  link('customers', 'Customers', { icon: 'user' }),
]);
function navigate(item: NavItem, e: MouseEvent) {
  e.preventDefault();
  page.value = item.key ?? 'orders';
}
</script>

<template>
  <div class="column">
    <QNav :items="items" aria-label="Products navigation" @navigate="navigate" />
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
