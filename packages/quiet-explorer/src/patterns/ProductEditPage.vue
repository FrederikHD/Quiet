<!-- A back-office product edit page, built only from Quiet's components: one form across two columns, variants, images, a sticky Save and a guard against losing changes. -->
<script setup lang="ts">
import {
  QAppShell,
  QBadge,
  QButton,
  QCard,
  QCheckbox,
  QCheckboxGroup,
  QCombobox,
  QDialog,
  QEmptyState,
  QField,
  QFieldGroup,
  QFileUpload,
  QForm,
  QFormActions,
  QInput,
  QNav,
  QPage,
  QPageColumns,
  QSelect,
  QTable,
  QTextarea,
  toast,
  type BadgeTone,
  type ComboboxOption,
  type FormError,
  type NavSection,
} from '@frederikhd/quiet';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { photo, swatchOf } from '../fixtures/pictures';

const colours = ['Navy', 'Sand', 'Olive', 'Rust', 'Natural'];
const sizes = ['XS', 'S', 'M', 'L', 'XL'];
const collections: ComboboxOption[] = ['Linen', 'Men', 'Summer', 'New in', 'Sale', 'Shirts', 'Essentials'].map((c) => ({
  value: c,
  label: c,
}));

interface Upload {
  key: string;
  name: string;
  size?: number;
  url?: string;
  file?: File;
}
interface Product {
  title: string;
  description: string;
  images: Upload[];
  price: string;
  compareAt: string;
  cost: string;
  colours: string[];
  sizes: string[];
  /** Per variant ("Navy / M"): its own price (empty: the product's) and stock. */
  variants: Record<string, { price: string; stock: string }>;
  status: string;
  type: string;
  vendor: string | null;
  collections: ComboboxOption[];
  taxable: boolean;
}

const variantsOf = (p: Pick<Product, 'colours' | 'sizes'>) =>
  p.colours.flatMap((c) => p.sizes.map((s) => ({ id: `${c} / ${s}`, colour: c, size: s })));

// What the server has. The form edits a copy, so "changed" is a comparison and Discard is a copy back.
const saved = ref<Product>({
  title: 'Linen shirt',
  description: 'A relaxed shirt in washed European linen. It softens with every wash and keeps you cool on warm days.',
  images: [
    { key: 'navy-front', name: 'linen-shirt-navy-front.jpg', size: 412_000, url: photo('Navy') },
    { key: 'navy-back', name: 'linen-shirt-navy-back.jpg', size: 398_000, url: photo('Navy', 1) },
    { key: 'sand-front', name: 'linen-shirt-sand-front.jpg', size: 405_000, url: photo('Sand') },
  ],
  price: '59,00',
  compareAt: '',
  cost: '21,50',
  colours: ['Navy', 'Sand'],
  sizes: ['S', 'M', 'L', 'XL'],
  variants: Object.fromEntries(
    variantsOf({ colours: ['Navy', 'Sand'], sizes: ['S', 'M', 'L', 'XL'] }).map((v, i) => [
      v.id,
      { price: '', stock: String([12, 30, 18, 0, 6, 22, 9, 4][i]) },
    ]),
  ),
  status: 'Active',
  type: 'Shirt',
  vendor: 'Leinen & Co',
  collections: collections.filter((c) => ['Linen', 'Men', 'Summer'].includes(c.label)),
  taxable: true,
});
const copy = (p: Product): Product => ({
  ...p,
  images: p.images.map((i) => ({ ...i })),
  colours: [...p.colours],
  sizes: [...p.sizes],
  variants: Object.fromEntries(Object.entries(p.variants).map(([k, v]) => [k, { ...v }])),
  collections: [...p.collections],
});
const draft = ref<Product>(copy(saved.value));
const changed = computed(() => JSON.stringify(draft.value) !== JSON.stringify(saved.value));
const savedAt = ref('Last saved yesterday at 16:42');

// The variant rows follow the colours and sizes ticked; a new one starts at the product's price with no stock.
const variants = computed(() =>
  variantsOf(draft.value).map((v) => {
    draft.value.variants[v.id] ??= { price: '', stock: '0' };
    return { ...v, ...draft.value.variants[v.id] };
  }),
);
const stockTotal = computed(() => variants.value.reduce((n, v) => n + (Number(v.stock) || 0), 0));

const statusTone: Record<string, BadgeTone> = { Active: 'success', Draft: 'neutral', Archived: 'neutral' };
const statusHint: Record<string, string> = {
  Active: 'Customers can find and buy it.',
  Draft: 'Hidden from the shop until you make it active.',
  Archived: 'Hidden from the shop and from product lists here.',
};

// Validation: on Save, then again as people fix what was wrong.
const num = (s: string) => parseFloat(s.replace(/\./g, '').replace(',', '.'));
const isMoney = (s: string) => /^\d{1,3}(\.?\d{3})*(,\d{1,2})?$/.test(s.trim());
const tried = ref(false);
const errors = computed(() => {
  const d = draft.value;
  const e: Record<string, string> = {};
  if (!d.title.trim()) e['pe-title'] = 'Enter a product title';
  if (!d.price.trim()) e['pe-price'] = 'Enter a price, like 49,90';
  else if (!isMoney(d.price)) e['pe-price'] = 'Enter the price as an amount, like 49,90';
  if (d.compareAt.trim() && (!isMoney(d.compareAt) || num(d.compareAt) <= num(d.price)))
    e['pe-compare'] = 'Enter a compare-at price higher than the price, or leave it empty';
  if (!d.images.length) e['pe-images'] = 'Add at least one image';
  if (!d.colours.length || !d.sizes.length) e['pe-options'] = 'Choose at least one colour and one size';
  for (const v of variants.value) {
    const id = `pe-stock-${v.colour}-${v.size}`;
    if (!/^\d+$/.test(v.stock.trim())) e[id] = `Enter the stock of ${v.id} as a whole number, like 12`;
    if (v.price.trim() && !isMoney(v.price))
      e[`pe-vprice-${v.colour}-${v.size}`] = `Enter the price of ${v.id} as an amount, or leave it empty`;
  }
  return e;
});
const shown = computed(() => (tried.value ? errors.value : {}));
const summary = computed<FormError[] | null>(() =>
  tried.value && Object.keys(errors.value).length
    ? Object.entries(errors.value).map(([id, message]) => ({ id, message }))
    : null,
);
const belowCost = computed(
  () => !shown.value['pe-price'] && isMoney(draft.value.price) && num(draft.value.price) < num(draft.value.cost),
);

function save() {
  tried.value = true;
  if (Object.keys(errors.value).length) return;
  // Variants that were unticked are dropped when saved.
  const keep = new Set(variants.value.map((v) => v.id));
  draft.value.variants = Object.fromEntries(Object.entries(draft.value.variants).filter(([k]) => keep.has(k)));
  saved.value = copy(draft.value);
  tried.value = false;
  savedAt.value = 'Last saved just now';
  toast('Product saved', { tone: 'success' });
}

// Leaving with unsaved changes asks first: Discard, the back link and the nav all go through here.
const leaving = ref<null | { label: string; go: () => void }>(null);
function leave(label: string, go: () => void) {
  if (changed.value) leaving.value = { label, go };
  else go();
}
function discard() {
  draft.value = copy(saved.value);
  tried.value = false;
  const go = leaving.value?.go;
  leaving.value = null;
  go?.();
  // The Discard button that opened the dialog is disabled now (nothing left to discard): focus the heading.
  focusTitle();
}
// …and so does closing the tab or reloading.
const onUnload = (e: BeforeUnloadEvent) => {
  if (changed.value) e.preventDefault();
};
onMounted(() => window.addEventListener('beforeunload', onUnload));
onBeforeUnmount(() => window.removeEventListener('beforeunload', onUnload));

const deleting = ref(false);
const deleted = ref(false);
// Deleting (and its Undo) swaps the whole page: focus the new page's heading instead of losing focus to the page.
const frame = ref<HTMLElement | null>(null);
async function focusTitle() {
  await nextTick();
  const h1 = frame.value?.querySelector<HTMLElement>('.q-page__title');
  if (!h1) return;
  h1.tabIndex = -1;
  h1.focus();
}
watch(deleted, focusTitle);
function remove() {
  deleting.value = false;
  deleted.value = true;
  toast(`${saved.value.title} deleted`);
}

const sections: NavSection[] = [
  {
    items: [
      { key: 'home', label: 'Home', icon: 'home', href: '#home' },
      { key: 'orders', label: 'Orders', icon: 'bag', href: '#orders' },
      { key: 'products', label: 'Products', icon: 'package', href: '#products', current: true },
      { key: 'customers', label: 'Customers', icon: 'user', href: '#customers' },
    ],
  },
];
const elsewhere = (label: string) => () => toast(`${label} isn't part of this pattern`);
</script>

<template>
  <div ref="frame" class="frame">
    <QAppShell brand="Leinen & Co" contained :toaster="false">
      <template #nav>
        <QNav
          :sections="sections"
          @navigate="
            (item, e) => {
              e.preventDefault();
              leave(item.label, elsewhere(item.label));
            }
          "
        />
      </template>

      <QPage v-if="deleted" title="Products">
        <QEmptyState icon="package" :title="`${saved.title} was deleted`" role="status">
          It's gone from the shop and from your product list.
          <template #actions><QButton @click="deleted = false">Undo</QButton></template>
        </QEmptyState>
      </QPage>

      <QPage
        v-else
        :title="saved.title"
        :subtitle="`SKU LS-2041 · ${savedAt}`"
        :back="{ href: '#products', label: 'Products' }"
        @back="
          (e) => {
            e.preventDefault();
            leave('Products', elsewhere('The product list'));
          }
        "
      >
        <template #title-meta>
          <QBadge :tone="statusTone[saved.status]">{{ saved.status }}</QBadge>
          <QBadge v-if="changed" tone="warning">Unsaved changes</QBadge>
        </template>
        <template #actions>
          <QButton icon-start="copy" @click="toast(`Duplicated as “${saved.title} (copy)”`)">Duplicate</QButton>
          <QButton icon-start="external-link" @click="toast('Opens the product page in the shop')">Preview</QButton>
        </template>

        <QForm label-placement="top" :errors="summary" @submit.prevent="save">
          <QPageColumns>
            <QCard title="Details">
              <QField id="pe-title" label="Title" required :error="shown['pe-title']">
                <QInput v-model="draft.title" placeholder="e.g. Linen shirt" />
              </QField>
              <QField label="Description" hint="Shown on the product page, under the price.">
                <QTextarea v-model="draft.description" auto-grow :max-rows="10" :maxlength="1000" />
              </QField>
            </QCard>

            <QCard title="Images">
              <QField
                id="pe-images"
                label="Images"
                label-hidden
                required
                :error="shown['pe-images']"
                hint="JPG, PNG, WebP or GIF, up to 5 MB each, at most 8. The first is the main image."
              >
                <QFileUpload v-model="draft.images" variant="images" :max-size="5 * 1024 * 1024" :max-files="8" />
              </QField>
            </QCard>

            <QCard title="Pricing" description="Prices include VAT.">
              <QFieldGroup label="Price" label-hidden :columns="[1, 1]">
                <QField
                  id="pe-price"
                  label="Price"
                  required
                  :error="shown['pe-price']"
                  :warning="
                    belowCost ? `This is below the cost of ${draft.cost} €, so you lose money on every sale.` : null
                  "
                >
                  <QInput v-model="draft.price" suffix="€" numeric align="end" inputmode="decimal" />
                </QField>
                <QField
                  id="pe-compare"
                  label="Compare-at price"
                  :error="shown['pe-compare']"
                  help="The original price, struck through next to the price while the product is on sale."
                >
                  <QInput v-model="draft.compareAt" suffix="€" numeric align="end" inputmode="decimal" />
                </QField>
              </QFieldGroup>
              <QFieldGroup label="Cost" label-hidden :columns="[1, 1]">
                <QField label="Cost per item" hint="Customers don't see this.">
                  <QInput v-model="draft.cost" suffix="€" numeric align="end" inputmode="decimal" />
                </QField>
                <QField label="Margin">
                  <QInput
                    :model-value="
                      isMoney(draft.price) && num(draft.price) > 0
                        ? `${Math.round(((num(draft.price) - num(draft.cost)) / num(draft.price)) * 100)} %`
                        : '–'
                    "
                    readonly
                    numeric
                    align="end"
                  />
                </QField>
              </QFieldGroup>
              <QCheckbox v-model="draft.taxable" label="Charge VAT on this product" />
            </QCard>

            <QCard
              title="Variants"
              :description="`${variants.length} variants · ${stockTotal} in stock. A variant without a price of its own sells at the product's price.`"
            >
              <QFieldGroup id="pe-options" label="Options" label-hidden :error="shown['pe-options']">
                <QField label="Colours">
                  <QCheckboxGroup v-model="draft.colours" label="Colours" label-hidden layout="swatches">
                    <QCheckbox v-for="c in colours" :key="c" :value="c" :label="c" :swatch="swatchOf(c)" />
                  </QCheckboxGroup>
                </QField>
                <QField label="Sizes">
                  <QCheckboxGroup v-model="draft.sizes" label="Sizes" label-hidden layout="buttons">
                    <QCheckbox v-for="s in sizes" :key="s" :value="s" :label="s" />
                  </QCheckboxGroup>
                </QField>
              </QFieldGroup>
              <QTable
                v-if="variants.length"
                caption="Variants"
                caption-hidden
                mobile="cards"
                :cards-below="420"
                :rows="variants"
                :columns="[
                  { key: 'id', header: 'Variant', minWidth: '9rem' },
                  { key: 'price', header: 'Price', minWidth: '7.5rem' },
                  { key: 'stock', header: 'Stock', minWidth: '6rem' },
                ]"
              >
                <template #cell-id="{ row }">
                  <span class="variant"
                    ><span class="dot" :style="{ background: swatchOf(row.colour) }" aria-hidden="true" />{{
                      row.id
                    }}</span
                  >
                </template>
                <template #cell-price="{ row }">
                  <QInput
                    :id="`pe-vprice-${row.colour}-${row.size}`"
                    v-model="draft.variants[row.id].price"
                    size="slim"
                    suffix="€"
                    numeric
                    align="end"
                    inputmode="decimal"
                    :placeholder="draft.price"
                    :aria-label="`Price of ${row.id}`"
                    :invalid="!!shown[`pe-vprice-${row.colour}-${row.size}`]"
                  />
                </template>
                <template #cell-stock="{ row }">
                  <QInput
                    :id="`pe-stock-${row.colour}-${row.size}`"
                    v-model="draft.variants[row.id].stock"
                    size="slim"
                    numeric
                    align="end"
                    inputmode="numeric"
                    :aria-label="`Stock of ${row.id}`"
                    :invalid="!!shown[`pe-stock-${row.colour}-${row.size}`]"
                  />
                </template>
              </QTable>
            </QCard>

            <template #aside>
              <QCard title="Status">
                <QField label="Status" label-hidden :hint="statusHint[draft.status]">
                  <QSelect v-model="draft.status" :options="['Active', 'Draft', 'Archived']" />
                </QField>
              </QCard>
              <QCard title="Organisation">
                <QField label="Product type"><QInput v-model="draft.type" /></QField>
                <QField label="Vendor">
                  <QSelect v-model="draft.vendor" :options="['Leinen & Co', 'Atelier Nord', 'Flachs Weberei']" />
                </QField>
                <QField label="Collections">
                  <QCombobox
                    v-model="draft.collections"
                    multiple
                    placeholder="Add to collections"
                    :options="collections"
                  />
                </QField>
              </QCard>
            </template>
          </QPageColumns>

          <QFormActions align="start">
            <QButton variant="danger-outline" @click="deleting = true">Delete product</QButton>
          </QFormActions>
          <QFormActions sticky>
            <QButton :disabled="!changed" @click="leave('', () => {})">Discard</QButton>
            <QButton variant="primary" type="submit">Save</QButton>
          </QFormActions>
        </QForm>
      </QPage>
    </QAppShell>

    <QDialog :open="!!leaving" title="Discard unsaved changes?" @update:open="(o) => !o && (leaving = null)">
      Your changes to {{ saved.title }} haven't been saved. If you leave, they're lost.
      <template #footer>
        <QButton @click="leaving = null">Keep editing</QButton>
        <QButton variant="danger" @click="discard">Discard changes</QButton>
      </template>
    </QDialog>

    <QDialog v-model:open="deleting" :title="`Delete ${saved.title}?`">
      It's removed from the shop and from your product list, with its {{ variants.length }} variants. Orders that
      already include it keep it.
      <template #footer>
        <QButton @click="deleting = false">Cancel</QButton>
        <QButton variant="danger" @click="remove">Delete product</QButton>
      </template>
    </QDialog>
  </div>
</template>

<style scoped>
.frame {
  height: 760px;
}
.variant {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.12);
}
</style>
