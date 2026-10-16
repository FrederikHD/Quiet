<script setup lang="ts">
import { QNav, type NavItem, type NavSection } from 'quiet';
import { ref } from 'vue';

const current = ref<Record<string, string>>({ comfortable: 'inventory', compact: 'orders' });

function sections(density: string): NavSection[] {
  const it = (key: string, label: string, extra: Partial<NavItem> = {}): NavItem => ({
    key, label, href: `#${key}`, current: current.value[density] === key, ...extra,
  });
  return [
    {
      items: [
        it('home', 'Home', { icon: 'home' }),
        it('orders', 'Orders', { icon: 'bag', badge: 12, badgeLabel: '12 to fulfil' }),
        it('products', 'Products', { icon: 'package', items: [it('collections', 'Collections'), it('inventory', 'Inventory'), it('gift', 'Gift cards')] }),
        it('customers', 'Customers', { icon: 'user' }),
        it('discounts', 'Discounts', { icon: 'percent', badge: 2 }),
      ],
    },
    { title: 'Shop', items: [it('online', 'Online store', { icon: 'external-link' }), it('settings', 'Settings', { icon: 'sliders' })] },
  ];
}
function go(density: string, item: NavItem, e: MouseEvent) {
  e.preventDefault();
  current.value = { ...current.value, [density]: item.key! };
}
</script>

<template>
  <div class="pv">
    <div v-for="d in ['comfortable', 'compact']" :key="d" :data-density="d">
      <p class="pv-title">{{ d === 'comfortable' ? 'Comfortable — Inventory open' : 'Compact' }}</p>
      <div class="col"><QNav :sections="sections(d)" :aria-label="`${d} navigation`" @navigate="(item, e) => go(d, item, e)" /></div>
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(248px, 100%), 280px)); gap: var(--space-8); align-items: start; }
.col { padding: var(--space-3); background: var(--surface-raised); border: 1px solid var(--line); border-radius: var(--radius-lg); }
.pv-title { margin: 0 0 var(--space-2); font: var(--text-caption); color: var(--ink-muted); }
</style>
