<script setup lang="ts">
import { QAppShell, QBadge, QButton, QCard, QNav, QPage, QTable, type NavItem } from 'quiet';
import { computed, ref } from 'vue';

// A whole back-office screen inside a frame, so it doesn't take over the explorer.
const page = ref('home');
const item = (key: string, label: string, extra: Partial<NavItem> = {}): NavItem => ({ key, label, href: `#${key}`, current: page.value === key, ...extra });
const sections = computed(() => [
  {
    items: [
      item('home', 'Home', { icon: 'home' }),
      item('orders', 'Orders', { icon: 'bag', badge: 12, badgeLabel: '12 to fulfil' }),
      item('products', 'Products', { icon: 'package', items: [item('collections', 'Collections'), item('inventory', 'Inventory')] }),
      item('customers', 'Customers', { icon: 'user' }),
      item('discounts', 'Discounts', { icon: 'percent' }),
    ],
  },
  { title: 'Shop', items: [item('online', 'Online store', { icon: 'external-link' }), item('settings', 'Settings', { icon: 'sliders' })] },
]);
function navigate(it: NavItem, e: MouseEvent) {
  e.preventDefault();
  page.value = it.key ?? 'home';
}
const orders = [
  { id: '#10500', customer: 'Anna Schmidt', status: 'Unfulfilled', tone: 'warning', total: '19,90 €' },
  { id: '#10499', customer: 'Noah Koch', status: 'Unfulfilled', tone: 'warning', total: '57,03 €' },
  { id: '#10498', customer: 'Lea Fischer', status: 'Shipped', tone: 'info', total: '94,16 €' },
  { id: '#10497', customer: 'Ben Klein', status: 'Fulfilled', tone: 'success', total: '131,29 €' },
] as const;
const title = computed(() => (page.value === 'home' ? 'Good morning, Anna' : page.value.charAt(0).toUpperCase() + page.value.slice(1)));
</script>

<template>
  <div class="frame">
    <QAppShell brand="Leinen & Co" :toaster="false">
      <template #nav><QNav :sections="sections" @navigate="navigate" /></template>
      <template #nav-footer>
        <div class="account">
          <span class="avatar" aria-hidden="true">AS</span>
          <div class="who">Anna Schulz<span>Leinen &amp; Co</span></div>
        </div>
      </template>
      <template #top-bar-end><QButton variant="ghost" icon-start="search" aria-label="Search" /></template>
      <QPage :title="title" subtitle="Tuesday, 13 October">
        <template #actions><QButton variant="primary" icon-start="plus">Create order</QButton></template>
        <div class="kpis">
          <QCard v-for="k in [['4.210 €', 'Sales today'], ['38', 'Orders today'], ['12', 'To fulfil']]" :key="k[1]">
            <div class="metric">{{ k[0] }}</div>
            <div class="label">{{ k[1] }}</div>
          </QCard>
        </div>
        <QTable
          caption="Orders to fulfil"
          density="compact"
          mobile="cards"
          :rows="[...orders]"
          row-key="id"
          :columns="[
            { key: 'id', header: 'Order' },
            { key: 'customer', header: 'Customer' },
            { key: 'status', header: 'Status' },
            { key: 'total', header: 'Total', numeric: true },
          ]"
          @row-click="() => {}"
        >
          <template #cell-status="{ row }"><QBadge :tone="row.tone">{{ row.status }}</QBadge></template>
        </QTable>
      </QPage>
    </QAppShell>
  </div>
</template>

<style scoped>
.frame { height: 560px; overflow: auto; border: 1px solid var(--line); border-radius: var(--radius-md); transform: translateZ(0); }
.account { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-1) var(--space-2); }
.avatar { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; flex: none; border-radius: var(--radius-full); background: var(--brand-tint); color: var(--brand); font: var(--text-label); font-weight: 600; }
.who { min-width: 0; font: var(--text-small); }
.who span { display: block; color: var(--ink-muted); }
.kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(180px, 100%), 1fr)); gap: var(--space-4); }
.metric { font: var(--text-metric); font-variant-numeric: tabular-nums; }
.label { font: var(--text-small); color: var(--ink-muted); }
</style>
