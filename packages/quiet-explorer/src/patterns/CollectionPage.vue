<!-- A storefront collection, built only from Quiet's components: filters, chips, sort, the grid and "Show more". -->
<script setup lang="ts">
import {
  QBreadcrumbs,
  QButton,
  QDialog,
  QEmptyState,
  QFilterChips,
  QProductCard,
  QSelect,
  money,
  toast,
  type ItemKey,
} from '@frederikhd/quiet';
import { computed, nextTick, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { photo, swatchOf } from '../fixtures/pictures';
import CollectionFilters, { type Filters } from './CollectionFilters.vue';
import StoreHeader from './StoreHeader.vue';

// 40 linen pieces, each in one to three colours.
const kinds = [
  ['Linen shirt', 59],
  ['Linen trousers', 79],
  ['Linen shorts', 49],
  ['Linen overshirt', 99],
  ['Linen T-shirt', 39],
  ['Linen chinos', 89],
  ['Linen scarf', 29],
  ['Linen jacket', 149],
] as const;
const palette = ['Navy', 'Sand', 'Olive', 'Rust', 'Natural', 'Sage'];
const editions = ['', 'Relaxed ', 'Washed ', 'Heavy ', 'Classic '];
interface Product {
  id: number;
  name: string;
  price: number;
  compareAt?: number;
  colours: string[];
  sizes: string[];
  inStock: boolean;
  added: number;
  rating?: { value: number; count: number };
}
const products: Product[] = Array.from({ length: 40 }, (_, i) => {
  const [kind, base] = kinds[i % kinds.length];
  const edition = editions[Math.floor(i / kinds.length) % editions.length];
  return {
    id: i + 1,
    name: `${edition}${edition ? kind.toLowerCase() : kind}`.replace(/^./, (c) => c.toUpperCase()),
    price: base + (i % 3) * 10,
    compareAt: i % 7 === 3 ? base + 40 : undefined,
    colours: palette.filter((_, c) => (i + c) % 4 === 0 || c === i % palette.length).slice(0, 3),
    sizes: ['XS', 'S', 'M', 'L', 'XL'].filter((_, s) => (i + s) % 3 !== 0),
    inStock: i % 6 !== 5,
    added: 40 - i,
    rating: i % 4 === 0 ? undefined : { value: 3.6 + ((i * 7) % 14) / 10, count: 3 + ((i * 11) % 40) },
  };
});
const priceBounds: [number, number] = [
  Math.floor(Math.min(...products.map((p) => p.price)) / 10) * 10,
  Math.ceil(Math.max(...products.map((p) => p.price)) / 10) * 10,
];

// Filters and sort live in the URL, so a filtered list can be shared and the Back button restores it.
const route = useRoute();
const router = useRouter();
const list = (v: unknown) => (typeof v === 'string' && v ? v.split(',') : []);
const filters = computed<Filters>({
  get: () => ({
    colours: list(route.query.colour),
    sizes: list(route.query.size),
    price: [Number(route.query.min) || priceBounds[0], Number(route.query.max) || priceBounds[1]] as [number, number],
    inStock: route.query.stock === '1',
  }),
  set: (f: Filters) =>
    void router.replace({
      query: {
        ...route.query,
        colour: f.colours.join(',') || undefined,
        size: f.sizes.join(',') || undefined,
        min: f.price[0] !== priceBounds[0] ? String(f.price[0]) : undefined,
        max: f.price[1] !== priceBounds[1] ? String(f.price[1]) : undefined,
        stock: f.inStock ? '1' : undefined,
      },
    }),
});
const sort = computed({
  get: () => (typeof route.query.sort === 'string' ? route.query.sort : 'featured'),
  set: (s: string | null) =>
    void router.replace({ query: { ...route.query, sort: s && s !== 'featured' ? s : undefined } }),
});

const matches = (p: Product, f: Filters, skip?: keyof Filters) =>
  (skip === 'colours' || !f.colours.length || p.colours.some((c) => f.colours.includes(c))) &&
  (skip === 'sizes' || !f.sizes.length || p.sizes.some((s) => f.sizes.includes(s))) &&
  p.price >= f.price[0] &&
  p.price <= f.price[1] &&
  (!f.inStock || p.inStock);
const results = computed(() => {
  const hits = products.filter((p) => matches(p, filters.value));
  const by = {
    featured: (a: Product, b: Product) => a.id - b.id,
    newest: (a: Product, b: Product) => b.added - a.added,
    'price-asc': (a: Product, b: Product) => a.price - b.price,
    'price-desc': (a: Product, b: Product) => b.price - a.price,
  }[sort.value as 'featured'];
  return by ? [...hits].sort(by) : hits;
});
// What each option would show with the other filters as they are, so options with nothing behind them are disabled.
const counts = computed(() => {
  const count = (skip: keyof Filters, has: (p: Product) => string[]) => {
    const out: Record<string, number> = {};
    for (const p of products.filter((p) => matches(p, filters.value, skip)))
      for (const v of has(p)) out[v] = (out[v] ?? 0) + 1;
    return out;
  };
  return { colours: count('colours', (p) => p.colours), sizes: count('sizes', (p) => p.sizes) };
});

// The chips: one per filter in use.
const chips = computed(() => [
  ...filters.value.colours.map((c) => ({ key: `colour:${c}`, label: c, swatch: swatchOf(c) })),
  ...filters.value.sizes.map((s) => ({ key: `size:${s}`, label: `Size ${s}` })),
  filters.value.price[0] !== priceBounds[0] || filters.value.price[1] !== priceBounds[1]
    ? { key: 'price', label: `${money(filters.value.price[0])} – ${money(filters.value.price[1])}` }
    : null,
  filters.value.inStock ? { key: 'stock', label: 'In stock' } : null,
]);
const activeCount = computed(() => chips.value.filter(Boolean).length);
function removeChip(key: ItemKey) {
  const [kind, value] = String(key).split(':');
  const f = filters.value;
  if (kind === 'colour') filters.value = { ...f, colours: f.colours.filter((c) => c !== value) };
  else if (kind === 'size') filters.value = { ...f, sizes: f.sizes.filter((s) => s !== value) };
  else if (kind === 'price') filters.value = { ...f, price: [...priceBounds] };
  else filters.value = { ...f, inStock: false };
}
function clearAll() {
  filters.value = { colours: [], sizes: [], price: [...priceBounds], inStock: false };
}

// 12 at a time; "Show more" moves focus to the first new product.
const page = 12;
const shown = ref(page);
watch([filters, sort], () => (shown.value = page));
const grid = ref<HTMLElement | null>(null);
async function showMore() {
  const first = shown.value;
  shown.value += page;
  await nextTick();
  grid.value?.querySelectorAll<HTMLElement>('.q-pcard__link')[first]?.focus();
}

const sheetOpen = ref(false);
const cart = ref(1);
</script>

<template>
  <div class="store">
    <StoreHeader :cart-count="cart" @open-cart="toast('The cart drawer is on the product page pattern')" />

    <main class="collection">
      <div class="collection__head">
        <QBreadcrumbs
          :items="[{ label: 'Home', href: '#store' }, { label: 'Men', href: '#men' }, { label: 'Linen' }]"
        />
        <h2 class="collection__title">Linen for men</h2>
        <p class="collection__intro">Shirts, trousers and jackets in washed European linen, made to be worn often.</p>
      </div>

      <div class="collection__body">
        <aside class="collection__filters" aria-label="Filters">
          <CollectionFilters v-model="filters" :counts="counts" :price-bounds="priceBounds" />
        </aside>

        <section class="collection__results" aria-label="Products">
          <div class="collection__bar">
            <QButton class="collection__filterbtn" icon-start="filter" :expanded="sheetOpen" @click="sheetOpen = true">
              Filter{{ activeCount ? ` (${activeCount})` : '' }}
            </QButton>
            <p class="collection__count" role="status">
              {{ results.length === 1 ? '1 product' : `${results.length} products` }}
            </p>
            <QSelect
              v-model="sort"
              size="slim"
              aria-label="Sort by"
              prefix-icon="list"
              class="collection__sort"
              :options="[
                { value: 'featured', label: 'Featured' },
                { value: 'newest', label: 'Newest' },
                { value: 'price-asc', label: 'Price, low to high' },
                { value: 'price-desc', label: 'Price, high to low' },
              ]"
            />
          </div>
          <QFilterChips v-if="activeCount" :items="chips" @remove="removeChip" @clear="clearAll" />

          <QEmptyState v-if="!results.length" icon="filter" title="No products match these filters" role="status">
            Try removing a filter or two.
            <template #actions><QButton @click="clearAll">Clear filters</QButton></template>
          </QEmptyState>
          <template v-else>
            <ul ref="grid" class="collection__grid">
              <li v-for="p in results.slice(0, shown)" :key="p.id">
                <QProductCard
                  :name="p.name"
                  :href="`#product-${p.id}`"
                  :image="{ src: photo(p.colours[0], p.name.includes('scarf') ? 2 : 0) }"
                  :price="p.price"
                  :compare-at="p.compareAt"
                  :rating="p.rating"
                  :sold-out="!p.inStock"
                  :swatches="p.colours.length > 1 ? p.colours.map((c) => ({ label: c, color: swatchOf(c) })) : []"
                />
              </li>
            </ul>
            <div v-if="shown < results.length" class="collection__more">
              <p>Showing {{ Math.min(shown, results.length) }} of {{ results.length }}</p>
              <QButton @click="showMore">Show more</QButton>
            </div>
          </template>
        </section>
      </div>
    </main>

    <QDialog v-model:open="sheetOpen" placement="end" title="Filter">
      <CollectionFilters v-model="filters" :counts="counts" :price-bounds="priceBounds" />
      <template #footer>
        <QButton :disabled="!activeCount" @click="clearAll">Clear all</QButton>
        <QButton variant="primary" @click="sheetOpen = false">
          {{ results.length === 1 ? 'Show 1 product' : `Show ${results.length} products` }}
        </QButton>
      </template>
    </QDialog>
  </div>
</template>

<style scoped>
.store {
  background: var(--surface);
}
.collection {
  display: grid;
  gap: var(--space-8);
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-4) var(--space-6) var(--space-16);
}
.collection__head {
  display: grid;
  gap: var(--space-2);
}
.collection__title {
  margin: var(--space-4) 0 0;
  font: var(--text-display);
}
.collection__intro {
  margin: 0;
  max-width: 60ch;
  color: var(--ink-muted);
}
.collection__body {
  display: grid;
  gap: var(--space-8);
}
.collection__filters {
  display: none;
}
.collection__results {
  display: grid;
  align-content: start;
  gap: var(--space-4);
}
.collection__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}
.collection__count {
  margin: 0;
  color: var(--ink-muted);
  font: var(--text-small);
}
.collection__sort {
  width: auto;
  margin-inline-start: auto;
}
.collection__grid {
  display: grid;
  /* Two columns on phones, 200px and wider above (the ProductCard grid). */
  grid-template-columns: repeat(auto-fill, minmax(min(200px, calc(50% - 8px)), 1fr));
  gap: var(--space-6) var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}
.collection__more {
  display: grid;
  justify-items: center;
  gap: var(--space-3);
  padding-top: var(--space-4);
}
.collection__more p {
  margin: 0;
  color: var(--ink-muted);
  font: var(--text-small);
}
/* Filters beside the grid from 900px; a Filter sheet below. */
@container (min-width: 900px) {
  .collection__body {
    grid-template-columns: 240px minmax(0, 1fr);
  }
  .collection__filters {
    display: block;
  }
  .collection__filterbtn {
    display: none;
  }
}
</style>
