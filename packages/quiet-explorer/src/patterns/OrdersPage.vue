<!-- A back-office order list and an order, built only from Quiet's components. -->
<script setup lang="ts">
import {
  QAddressFields,
  QAppShell,
  QBadge,
  QButton,
  QCard,
  QDescriptionList,
  QDialog,
  QEmptyState,
  QForm,
  QIcon,
  QInput,
  QMenu,
  QNav,
  QOrderSummary,
  QPage,
  QPagination,
  QTable,
  QTabs,
  money,
  toast,
  validateAddress,
  type Address,
  type BadgeTone,
  type MenuItem,
  type NavSection,
  type RowKey,
  type TableSort,
} from '@frederikhd/quiet';
import { computed, ref } from 'vue';
import { photo } from '../fixtures/pictures';

// 64 orders, filtered, sorted and paged here as a server would.
const customers = [
  ['Anna', 'Schmidt', 'Berlin', '10119'],
  ['Jonas', 'Weber', 'Hamburg', '20095'],
  ['Lea', 'Fischer', 'München', '80331'],
  ['Paul', 'Wagner', 'Köln', '50667'],
  ['Mia', 'Becker', 'Leipzig', '04109'],
  ['Felix', 'Hoffmann', 'Dresden', '01067'],
  ['Emma', 'Schulz', 'Bremen', '28195'],
];
const products = [
  ['Linen shirt', 59],
  ['Linen trousers', 79],
  ['Linen shorts', 49],
  ['Linen scarf', 29],
] as const;
type Payment = 'Paid' | 'Pending' | 'Refunded';
type Fulfilment = 'Unfulfilled' | 'Fulfilled';
interface Order {
  id: number;
  date: Date;
  address: Address;
  email: string;
  lines: { product: string; variant: string; quantity: number; price: number }[];
  payment: Payment;
  fulfilment: Fulfilment;
}
const orders = ref<Order[]>(
  Array.from({ length: 64 }, (_, i) => {
    const [firstName, lastName, city, postalCode] = customers[(i * 3) % customers.length];
    const date = new Date(2026, 9, 20, 9, 30);
    date.setHours(date.getHours() - i * 7);
    const lines = Array.from({ length: 1 + (i % 3) }, (_, j) => {
      const [product, price] = products[(i + j * 2) % products.length];
      const quantity = 1 + ((i + j) % 2);
      return {
        product,
        variant: ['Navy · M', 'Sand · L', 'Olive · S'][(i + j) % 3],
        quantity,
        price: price * quantity,
      };
    });
    return {
      id: 10564 - i,
      date,
      address: { country: 'DE', firstName, lastName, line1: `Torstraße ${10 + i}`, postalCode, city },
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      lines,
      payment: i % 9 === 4 ? 'Pending' : i % 13 === 7 ? 'Refunded' : 'Paid',
      fulfilment: i < 6 || i % 10 === 3 ? 'Unfulfilled' : 'Fulfilled',
    };
  }),
);
const totalOf = (o: Order) => o.lines.reduce((n, l) => n + l.price, 0) + shippingOf(o);
const shippingOf = (o: Order) => (o.lines.reduce((n, l) => n + l.price, 0) >= 50 ? 0 : 4.9);
const nameOf = (o: Order) => `${o.address.firstName} ${o.address.lastName}`;
const when = (d: Date) =>
  `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
const tone: Record<Payment | Fulfilment, BadgeTone> = {
  Paid: 'success',
  Pending: 'warning',
  Refunded: 'neutral',
  Fulfilled: 'success',
  Unfulfilled: 'warning',
};

// The list: a tab per view, search, sorting, selection and paging.
const view = ref('all');
const q = ref('');
const sort = ref<TableSort | null>({ key: 'date', direction: 'desc' });
const selected = ref<RowKey[]>([]);
const allMatching = ref(false);
const page = ref(1);
const pageSize = ref(10);
const inView = (o: Order, v: string) =>
  v === 'unfulfilled' ? o.fulfilment === 'Unfulfilled' : v === 'unpaid' ? o.payment === 'Pending' : true;
const tabs = computed(() =>
  [
    { value: 'all', label: 'All' },
    { value: 'unfulfilled', label: 'Unfulfilled' },
    { value: 'unpaid', label: 'Unpaid' },
  ].map((t) => ({ ...t, count: orders.value.filter((o) => inView(o, t.value)).length })),
);
const hits = computed(() => {
  const needle = q.value.trim().toLowerCase();
  const list = orders.value.filter(
    (o) => inView(o, view.value) && (!needle || `#${o.id} ${nameOf(o)}`.toLowerCase().includes(needle)),
  );
  const key = { date: (o: Order) => o.date.getTime(), total: totalOf, customer: nameOf, id: (o: Order) => o.id }[
    (sort.value?.key ?? 'date') as 'date'
  ];
  const dir = sort.value?.direction === 'asc' ? 1 : -1;
  return [...list].sort((x, y) => (key(x) < key(y) ? -1 : key(x) > key(y) ? 1 : 0) * dir);
});
const pageRows = computed(() => hits.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value));
function resetList() {
  page.value = 1;
  selected.value = [];
  allMatching.value = false;
}
const chosen = () => (allMatching.value ? hits.value : orders.value.filter((o) => selected.value.includes(o.id)));
function fulfil(list: Order[]) {
  const was = list.filter((o) => o.fulfilment === 'Unfulfilled');
  was.forEach((o) => (o.fulfilment = 'Fulfilled'));
  toast(was.length === 1 ? `Order #${was[0].id} marked as fulfilled` : `${was.length} orders marked as fulfilled`, {
    action: { label: 'Undo', onClick: () => was.forEach((o) => (o.fulfilment = 'Unfulfilled')) },
  });
  resetList();
}

// One order.
const openId = ref<number | null>(null);
const order = computed(() => orders.value.find((o) => o.id === openId.value) ?? null);
const orderMenu = computed<MenuItem[]>(() => [
  { label: 'Print packing slip', icon: 'download', onSelect: () => toast('Packing slip ready to print') },
  { label: 'Email customer', icon: 'mail', onSelect: () => toast(`Draft to ${order.value?.email}`) },
  { divider: true },
  {
    label: 'Refund',
    icon: 'credit-card',
    danger: true,
    disabled: order.value?.payment !== 'Paid',
    onSelect: () => (refunding.value = true),
  },
]);
// Destructive, so it is confirmed first.
const refunding = ref(false);
function refund() {
  refunding.value = false;
  order.value!.payment = 'Refunded';
  toast(`Order #${order.value!.id} refunded`);
}

// Editing its shipping address in a dialog.
const editing = ref(false);
const draft = ref<Address>({});
const tried = ref(false);
const check = computed(() => validateAddress(draft.value, { idPrefix: 'edit' }));
function editAddress() {
  draft.value = { ...order.value!.address };
  tried.value = false;
  editing.value = true;
}
function saveAddress() {
  tried.value = true;
  if (check.value.list.length) return;
  order.value!.address = { ...draft.value };
  editing.value = false;
  toast('Shipping address saved', { tone: 'success' });
}

const sections = computed<NavSection[]>(() => [
  {
    items: [
      { key: 'home', label: 'Home', icon: 'home', href: '#home' },
      {
        key: 'orders',
        label: 'Orders',
        icon: 'bag',
        href: '#orders',
        current: true,
        badge: tabs.value[1].count,
        badgeLabel: `${tabs.value[1].count} to fulfil`,
      },
      { key: 'products', label: 'Products', icon: 'package', href: '#products' },
      { key: 'customers', label: 'Customers', icon: 'user', href: '#customers' },
    ],
  },
]);
</script>

<template>
  <div class="frame">
    <QAppShell brand="Leinen & Co" contained :toaster="false">
      <template #nav>
        <QNav
          :sections="sections"
          @navigate="
            (item, e) => {
              e.preventDefault();
              if (item.key === 'orders') openId = null;
              else toast(`${item.label} isn't part of this pattern`);
            }
          "
        />
      </template>

      <QPage v-if="!order" title="Orders" density="compact">
        <template #actions>
          <QButton icon-start="download" @click="toast(`Exported ${hits.length} orders`)">Export</QButton>
          <QButton variant="primary" icon-start="plus" @click="toast('New order')">Create order</QButton>
        </template>
        <QTabs v-model="view" label="Order views" :tabs="tabs" @update:model-value="resetList">
          <QTable
            v-model:sort="sort"
            v-model:selected="selected"
            v-model:all-matching="allMatching"
            caption="Orders"
            caption-hidden
            mobile="cards"
            manual-sort
            selectable
            density="compact"
            row-key="id"
            :row-label="(o) => `order #${o.id}`"
            :total-count="hits.length"
            :rows="pageRows"
            :columns="[
              { key: 'id', header: 'Order', sortable: true, format: (o) => `#${o.id}` },
              {
                key: 'date',
                header: 'Date',
                sortable: true,
                sortLabels: ['Oldest first', 'Newest first'],
                sortFirst: 'desc',
                format: (o) => when(o.date),
              },
              { key: 'customer', header: 'Customer', sortable: true, truncate: true, format: nameOf },
              { key: 'payment', header: 'Payment' },
              { key: 'fulfilment', header: 'Fulfilment' },
              {
                key: 'total',
                header: 'Total',
                numeric: true,
                sortable: true,
                sortLabels: ['Lowest total first', 'Highest total first'],
                format: (o) => money(totalOf(o)),
              },
            ]"
            @update:sort="page = 1"
            @row-click="(o) => (openId = o.id)"
          >
            <template #toolbar>
              <QInput
                v-model="q"
                size="slim"
                class="search"
                aria-label="Search orders"
                placeholder="Search orders or customers"
                clearable
                @update:model-value="resetList"
              >
                <template #prefix><QIcon name="search" /></template>
              </QInput>
            </template>
            <template #cell-payment="{ row }"
              ><QBadge :tone="tone[row.payment]">{{ row.payment }}</QBadge></template
            >
            <template #cell-fulfilment="{ row }"
              ><QBadge :tone="tone[row.fulfilment]">{{ row.fulfilment }}</QBadge></template
            >
            <template #bulk-actions>
              <QButton size="slim" @click="fulfil(chosen())">Mark as fulfilled</QButton>
            </template>
            <template #empty>
              <QEmptyState title="No orders match" size="small" role="status">Try another search or view.</QEmptyState>
            </template>
            <template #footer>
              <QPagination
                v-model:page="page"
                v-model:page-size="pageSize"
                :total="hits.length"
                :page-size-options="[10, 25, 50]"
                @update:page="selected = []"
                @update:page-size="resetList"
              />
            </template>
          </QTable>
        </QTabs>
      </QPage>

      <QPage
        v-else
        :title="`#${order.id}`"
        :subtitle="`${when(order.date)} · Online store`"
        :back="{ href: '#orders', label: 'Orders' }"
        @back="
          (e) => {
            e.preventDefault();
            openId = null;
          }
        "
      >
        <template #title-meta>
          <QBadge :tone="tone[order.payment]">{{ order.payment }}</QBadge>
          <QBadge :tone="tone[order.fulfilment]">{{ order.fulfilment }}</QBadge>
        </template>
        <template #actions>
          <QMenu :label="`More actions for #${order.id}`" :items="orderMenu" variant="secondary" />
          <QButton v-if="order.fulfilment === 'Unfulfilled'" variant="primary" @click="fulfil([order])">
            Mark as fulfilled
          </QButton>
        </template>

        <QCard>
          <QOrderSummary
            :title="null"
            :items="
              order.lines.map((l, i) => ({
                id: String(i),
                name: l.product,
                variant: l.variant,
                quantity: l.quantity,
                price: l.price,
                image: { src: photo(l.variant.split(' · ')[0], l.product === 'Linen scarf' ? 2 : 0) },
              }))
            "
            :totals="[{ label: 'Shipping', detail: 'Standard', amount: shippingOf(order), free: !shippingOf(order) }]"
            :total="totalOf(order)"
            :tax-note="`Including ${money((totalOf(order) * 19) / 119)} VAT (19 %)`"
          />
        </QCard>

        <template #aside>
          <QCard title="Customer">
            <QDescriptionList
              layout="stacked"
              :items="[
                { term: 'Name', description: nameOf(order) },
                { term: 'Email', description: order.email, key: 'email' },
                { term: 'Orders', description: '3 orders since March' },
              ]"
            >
              <template #description-email="{ item }"
                ><a :href="`mailto:${item.description}`">{{ item.description }}</a></template
              >
            </QDescriptionList>
          </QCard>
          <QCard title="Shipping address">
            <template #actions>
              <QButton
                size="slim"
                variant="ghost"
                icon-start="pencil"
                aria-label="Edit shipping address"
                @click="editAddress"
              />
            </template>
            <p class="text">
              {{ nameOf(order) }}<br />{{ order.address.line1 }}<br />{{ order.address.postalCode }}
              {{ order.address.city }}<br />Germany
            </p>
          </QCard>
        </template>
      </QPage>
    </QAppShell>

    <QDialog v-model:open="refunding" :title="`Refund order #${order?.id}?`">
      The customer gets {{ order && money(totalOf(order)) }} back on the card they paid with. This can't be undone.
      <template #footer>
        <QButton @click="refunding = false">Cancel</QButton>
        <QButton variant="danger" @click="refund">Refund {{ order && money(totalOf(order)) }}</QButton>
      </template>
    </QDialog>

    <QDialog v-model:open="editing" title="Edit shipping address">
      <QForm id="edit-address" label-placement="top" :errors="tried ? check.list : null" @submit.prevent="saveAddress">
        <QAddressFields v-model="draft" id-prefix="edit" :errors="tried ? check.errors : {}" />
      </QForm>
      <template #footer>
        <QButton @click="editing = false">Cancel</QButton>
        <QButton variant="primary" type="submit" form="edit-address">Save address</QButton>
      </template>
    </QDialog>
  </div>
</template>

<style scoped>
.frame {
  height: 760px;
}
.search {
  flex: 1 1 200px;
  max-width: 320px;
}
.text {
  margin: 0;
}
</style>
