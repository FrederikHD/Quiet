<script setup lang="ts">
import { QCheckbox, QCombobox, QField, QForm, type ComboboxOption } from 'quiet';
import { ref } from 'vue';

// 1,240 fake products, as a server would hold them.
const kinds = ['Linen shirt', 'Linen trousers', 'Cotton tee', 'Wool jumper', 'Denim jacket', 'Silk scarf', 'Canvas tote', 'Leather belt', 'Knit beanie', 'Rain jacket'];
const colours = ['blue', 'sand', 'olive', 'black', 'white', 'rust', 'navy', 'grey'];
const hues: Record<string, string> = {
  blue: 'hsl(210 40% 55%)', sand: 'hsl(40 40% 55%)', olive: 'hsl(80 40% 55%)', black: 'hsl(0 0% 18%)',
  white: 'hsl(0 0% 92%)', rust: 'hsl(15 40% 55%)', navy: 'hsl(225 40% 55%)', grey: 'hsl(0 0% 60%)',
};
const sizes = ['XS', 'S', 'M', 'L', 'XL'];
const products = Array.from({ length: 1240 }, (_, i) => {
  const colour = colours[Math.floor(i / 10) % colours.length];
  return {
    id: `p${i}`,
    name: `${kinds[i % kinds.length]}, ${colour}, ${sizes[Math.floor(i / 80) % sizes.length]}`,
    sku: `LS-${2000 + i}`,
    price: `${19 + ((i * 7) % 90)},90 €`,
    stock: (i * 13) % 60,
    colour,
  };
});
const toOption = (p: (typeof products)[number]): ComboboxOption => ({
  value: p.id,
  label: p.name,
  description: `${p.sku} · ${p.stock === 0 ? 'out of stock' : `${p.stock} in stock`}`,
  meta: p.price,
  swatch: hues[p.colour],
  disabled: p.stock === 0,
});

const fail = ref(false);
// Your API call goes here. This fake one waits 400ms, matches name or SKU, returns the first 50 and the total.
function searchProducts(query: string, { signal }: { signal?: AbortSignal }) {
  return new Promise<{ options: ComboboxOption[]; total: number }>((resolve, reject) => {
    const t = setTimeout(() => {
      if (fail.value) return reject(new Error('Network error'));
      const q = query.toLowerCase();
      const hits = q ? products.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) : products;
      resolve({ options: hits.slice(0, 50).map(toOption), total: hits.length });
    }, 400);
    signal?.addEventListener('abort', () => {
      clearTimeout(t);
      reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
    });
  });
}

const product = ref<ComboboxOption | null>(null);
const picks = ref<ComboboxOption[]>([toOption(products[3]), toOption(products[11])]);
const vat = ref<ComboboxOption | null>(null);
const supplier = ref<ComboboxOption | null>({ value: 's1', label: 'Leinenweberei Rhön' });
const rates: ComboboxOption[] = [
  { value: 'de19', label: 'Germany, standard', meta: '19%' },
  { value: 'de7', label: 'Germany, reduced', meta: '7%' },
  { value: 'at20', label: 'Austria, standard', meta: '20%' },
  { value: 'at10', label: 'Austria, reduced', meta: '10%' },
  { value: 'ch81', label: 'Switzerland, standard', meta: '8.1%' },
  { value: 'ch26', label: 'Switzerland, reduced', meta: '2.6%' },
  { value: 'none', label: 'Tax exempt', meta: '0%' },
];
</script>

<template>
  <div class="pv">
    <div class="col">
      <p class="pv-title">Single, fetched — 50 shown of 1,240</p>
      <QForm label-placement="top">
        <QField label="Product" required hint="Search by name or SKU.">
          <QCombobox v-model="product" placeholder="Choose a product" search-placeholder="Search products" :search="searchProducts" clearable />
        </QField>
        <QField label="Add to collection" help="Products can be in several collections.">
          <QCombobox v-model="picks" multiple placeholder="Add products" search-placeholder="Search products" :search="searchProducts" name="products" />
        </QField>
      </QForm>
      <QCheckbox v-model="fail" label="Simulate a network failure" />
    </div>
    <div class="col" data-density="compact">
      <p class="pv-title">Static list, compact</p>
      <QForm label-placement="top">
        <QField label="Tax rate"><QCombobox v-model="vat" placeholder="Choose a rate" :options="rates" /></QField>
        <QField label="Supplier" disabled hint="Set on the purchase order.">
          <QCombobox v-model="supplier" :options="[{ value: 's1', label: 'Leinenweberei Rhön' }]" />
        </QField>
      </QForm>
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr)); gap: var(--space-8); align-items: start; }
.col { display: grid; gap: var(--field-gap); min-width: 0; }
.pv-title { margin: 0 0 var(--space-1); font: var(--text-caption); color: var(--ink-muted); }
</style>
