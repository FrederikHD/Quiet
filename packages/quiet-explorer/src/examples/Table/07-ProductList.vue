<!-- Compact rows with thumbnails. On a phone it scrolls sideways with the product pinned; max-height keeps the header in view. -->
<script setup lang="ts">
import { QBadge, QTable, money } from '@frederikhd/quiet';
import { tile } from '../../fixtures/pictures';

const products = ['Linen shirt, blue', 'Linen trousers, sand', 'Linen dress, olive', 'Linen apron, rust', 'Linen napkins (4)', 'Linen bed sheet, sage', 'Linen tea towel', 'Linen tote, natural'].map(
  (name, i) => ({
    id: `p${i}`,
    name,
    sku: `LS-${2040 + i * 7}`,
    stock: [24, 3, 0, 58, 12, 7, 31, 0][i],
    price: [59, 79, 99, 35, 24, 89, 14, 25][i],
    vendor: ['Leinenweberei Rhön', 'Atelier Nord', 'Leinenweberei Rhön', 'Strickhaus Allgäu'][i % 4],
  }),
);
</script>

<template>
  <QTable
    caption="Products"
    density="compact"
    :max-height="320"
    :default-sort="{ key: 'name', direction: 'asc' }"
    :row-href="(p) => `#product-${p.id}`"
    :rows="products"
    :columns="[
      { key: 'name', header: 'Product', sortable: true, minWidth: 'min(11rem, 40cqi)' },
      { key: 'sku', header: 'SKU', sortable: true },
      { key: 'stock', header: 'Stock', numeric: true, sortable: true },
      { key: 'price', header: 'Price', numeric: true, sortable: true, format: (p) => money(p.price) },
      { key: 'vendor', header: 'Vendor', sortable: true },
    ]"
  >
    <template #cell-name="{ row, index }">
      <span class="product"><img class="thumb" :src="tile(index * 40)" alt="" />{{ row.name }}</span>
    </template>
    <template #cell-stock="{ row }">
      <QBadge v-if="row.stock === 0" tone="danger">Out of stock</QBadge>
      <QBadge v-else-if="row.stock < 10" tone="warning">{{ row.stock }} left</QBadge>
      <template v-else>{{ row.stock }}</template>
    </template>
  </QTable>
</template>

<style scoped>
.product { display: inline-flex; align-items: center; gap: var(--space-3); }
.thumb { flex: none; width: 32px; height: 32px; border-radius: var(--radius-sm); }
</style>
