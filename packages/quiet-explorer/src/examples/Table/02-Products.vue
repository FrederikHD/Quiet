<script setup lang="ts">
import { QBadge, QButton, QCheckbox, QTable, money, type TableSort } from 'quiet';
import { ref } from 'vue';

// Compact, sorted by the table, scrolls sideways with the product pinned; the header stays while scrolling down.
const hues = [210, 40, 80, 15, 225, 140];
const products = ['Linen shirt, blue', 'Linen trousers, sand', 'Cotton tee, olive', 'Wool jumper, rust', 'Denim jacket, navy', 'Silk scarf, sage', 'Canvas tote, natural', 'Leather belt, brown'].map(
  (name, i) => ({
    id: `p${i}`,
    name,
    sku: `LS-${2040 + i * 7}`,
    stock: [24, 3, 0, 58, 12, 7, 31, 0][i],
    price: [59, 79, 29, 119, 149, 45, 25, 39][i],
    vendor: ['Leinenweberei Rhön', 'Atelier Nord', 'Baumwoll & Co', 'Strickhaus Allgäu'][i % 4],
    updated: `${i * 3 + 1} days ago`,
  }),
);
const loading = ref(false);
const empty = ref(false);
const sort = ref<TableSort | null>({ key: 'name', direction: 'asc' });
</script>

<template>
  <div data-density="compact">
    <div class="controls">
      <QCheckbox v-model="loading" label="Loading" />
      <QCheckbox v-model="empty" label="No rows" />
    </div>
    <QTable
      v-model:sort="sort"
      caption="Products"
      density="compact"
      :max-height="360"
      :loading="loading"
      :row-href="(p) => `#product-${p.id}`"
      :rows="empty ? [] : products"
      :columns="[
        { key: 'name', header: 'Product', sortable: true, minWidth: 'min(11rem, 40cqi)' },
        { key: 'sku', header: 'SKU', sortable: true },
        { key: 'stock', header: 'Stock', numeric: true, sortable: true },
        { key: 'price', header: 'Price', numeric: true, sortable: true, format: (p) => money(p.price) },
        { key: 'vendor', header: 'Vendor', sortable: true },
        { key: 'updated', header: 'Updated' },
      ]"
    >
      <template #cell-name="{ row, index }">
        <span class="prod"><span class="thumb" aria-hidden="true" :style="{ background: `hsl(${hues[index % hues.length]} 30% 62%)` }" />{{ row.name }}</span>
      </template>
      <template #cell-stock="{ row }">
        <QBadge v-if="row.stock === 0" tone="danger">Out of stock</QBadge>
        <QBadge v-else-if="row.stock < 10" tone="warning">{{ row.stock }} left</QBadge>
        <template v-else>{{ row.stock }}</template>
      </template>
      <template #row-actions="{ row }">
        <QButton size="slim" variant="ghost" icon-start="pencil" :aria-label="`Edit ${row.name}`" />
        <QButton size="slim" variant="ghost" icon-start="copy" :aria-label="`Duplicate ${row.name}`" />
      </template>
      <template #empty>No products yet. Add your first product to start selling.</template>
    </QTable>
  </div>
</template>

<style scoped>
.controls { display: flex; flex-wrap: wrap; gap: var(--space-4); margin-bottom: var(--space-2); }
.thumb { display: inline-block; flex: none; width: 32px; height: 32px; margin-right: var(--space-3); border-radius: var(--radius-sm); vertical-align: middle; }
.prod { display: inline-flex; align-items: center; vertical-align: middle; }
</style>
