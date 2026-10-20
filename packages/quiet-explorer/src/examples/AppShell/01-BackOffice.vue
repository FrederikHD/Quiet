<!-- A whole back-office screen: the navigation, the account under it, and a page. contained keeps it inside this box. -->
<script setup lang="ts">
import {
  QAppShell,
  QBadge,
  QButton,
  QCard,
  QMetric,
  QNav,
  QPage,
  QTable,
  type ItemKey,
  type NavItem,
  type NavSection,
} from '@frederikhd/quiet';
import { computed, ref } from 'vue';

const page = ref<ItemKey>('home');
const link = (key: string, label: string, extra: Partial<NavItem> = {}): NavItem => ({
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
      link('orders', 'Orders', { icon: 'bag', badge: 2, badgeLabel: '2 to fulfil' }),
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
const title = computed(() => sections.value.flatMap((s) => s.items).find((i) => i.current)?.label ?? 'Home');
function navigate(item: NavItem, e: MouseEvent) {
  e.preventDefault();
  page.value = item.key ?? 'home';
}
const orders = [
  { id: '#10500', customer: 'Anna Schmidt', status: 'Unfulfilled', total: '19,90 €' },
  { id: '#10499', customer: 'Noah Koch', status: 'Unfulfilled', total: '57,03 €' },
];
</script>

<template>
  <div class="box">
    <QAppShell brand="Leinen & Co" contained :toaster="false">
      <template #nav><QNav :sections="sections" @navigate="navigate" /></template>
      <template #nav-footer>
        <div class="account">
          <span class="avatar" aria-hidden="true">AS</span>
          <span>Anna Schulz<small>Owner</small></span>
        </div>
      </template>
      <template #top-bar-end><QButton variant="ghost" icon-start="search" aria-label="Search" /></template>
      <QPage :title="title" subtitle="Tuesday, 13 October">
        <template #actions><QButton variant="primary" icon-start="plus">Create order</QButton></template>
        <QCard><QMetric label="Sales today" value="4.210,00 €" /></QCard>
        <QTable
          caption="Orders to fulfil"
          density="compact"
          mobile="cards"
          :rows="orders"
          row-key="id"
          :columns="[
            { key: 'id', header: 'Order' },
            { key: 'customer', header: 'Customer' },
            { key: 'status', header: 'Status' },
            { key: 'total', header: 'Total', numeric: true },
          ]"
        >
          <template #cell-status="{ row }"
            ><QBadge tone="warning">{{ row.status }}</QBadge></template
          >
        </QTable>
      </QPage>
    </QAppShell>
  </div>
</template>

<style scoped>
.box {
  height: 560px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  overflow: hidden;
}
.account {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-1) var(--space-2);
  font: var(--text-small);
}
.account small {
  display: block;
  font: var(--text-caption);
  color: var(--ink-muted);
}
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: var(--brand-tint);
  color: var(--brand);
  font: var(--text-label);
}
</style>
