<!-- search fetches options as people type; older requests are aborted. The status line says how many of the 1,240 products are shown. -->
<script setup lang="ts">
import { QCombobox, QField, type ComboboxOption } from '@frederikhd/quiet';
import { ref } from 'vue';

// 1,240 fake products, as a server would hold them.
const kinds = ['Linen shirt', 'Linen trousers', 'Linen dress', 'Linen napkins', 'Linen tea towel'];
const colours: Record<string, string> = {
  blue: 'hsl(210 40% 55%)',
  sand: 'hsl(40 40% 55%)',
  olive: 'hsl(80 40% 45%)',
  rust: 'hsl(15 45% 50%)',
};
const products: ComboboxOption[] = Array.from({ length: 1240 }, (_, i) => {
  const colour = Object.keys(colours)[i % 4];
  const stock = (i * 13) % 60;
  return {
    value: `LS-${2000 + i}`,
    label: `${kinds[Math.floor(i / 4) % kinds.length]}, ${colour}`,
    description: `LS-${2000 + i} · ${stock === 0 ? 'out of stock' : `${stock} in stock`}`,
    meta: `${19 + ((i * 7) % 90)},90 €`,
    swatch: colours[colour],
    disabled: stock === 0,
  };
});

// Your API call goes here. This fake one waits 400ms and returns the first 50 matches and the total.
function searchProducts(query: string, { signal }: { signal?: AbortSignal }) {
  return new Promise<{ options: ComboboxOption[]; total: number }>((resolve, reject) => {
    const timer = setTimeout(() => {
      const q = query.toLowerCase();
      const hits = products.filter((p) => p.label.toLowerCase().includes(q) || p.value.toLowerCase().includes(q));
      resolve({ options: hits.slice(0, 50), total: hits.length });
    }, 400);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

const product = ref<ComboboxOption | null>(null);
</script>

<template>
  <QField label="Product" label-placement="top" required width="l" hint="Search by name or SKU.">
    <QCombobox
      v-model="product"
      placeholder="Choose a product"
      search-placeholder="Search products"
      :search="searchProducts"
      clearable
    />
  </QField>
</template>
