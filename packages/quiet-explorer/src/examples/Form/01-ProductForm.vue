<script setup lang="ts">
import { QButton, QField, QFieldGroup, QForm, QFormActions, QFormSection, QInput, type FormError, type LabelPlacement } from 'quiet';
import { computed, reactive, ref } from 'vue';

// Try the label placement, width and density, then save with an empty title or a missing width.
const placement = ref<LabelPlacement>('auto');
const width = ref<'wide' | 'narrow'>('wide');
const density = ref<'comfortable' | 'compact'>('comfortable');

const values = reactive({ title: '', sku: 'LS-2041-BL-M', price: '29,90', compare: '', cost: '32,00', length: '30', width: '', height: '4', code: 'AUTUMN10', origin: 'Portugal' });
const errors = ref<Record<string, string>>({});
const summary = ref<FormError[]>([]);
const saved = ref(false);

const num = (s: string) => parseFloat(String(s).replace(/\./g, '').replace(',', '.'));
function validate() {
  const e: Record<string, string> = {};
  if (!values.title.trim()) e.title = 'Enter a product title';
  if (!values.price.trim()) e.price = 'Enter a price, like 49,90';
  else if (Number.isNaN(num(values.price))) e.price = 'Enter the price as a number, like 49,90';
  if (values.compare && num(values.compare) <= num(values.price)) e.compare = 'Compare-at price must be higher than the price';
  if (!values.length || !values.width || !values.height) e.dims = 'Enter length, width and height to calculate shipping';
  return e;
}
function submit() {
  errors.value = validate();
  const order: [string, string][] = [['title', 'p-title'], ['price', 'p-price'], ['compare', 'p-compare'], ['dims', 'p-width']];
  summary.value = order.filter(([k]) => errors.value[k]).map(([k, id]) => ({ id, message: errors.value[k] }));
  saved.value = summary.value.length === 0;
}
const belowCost = computed(() => !errors.value.price && values.price && values.cost && num(values.price) < num(values.cost));
</script>

<template>
  <div class="pv">
    <div class="bar" data-density="compact">
      <span class="group" role="group" aria-label="Label placement">
        <span class="bar-label">Labels</span>
        <QButton v-for="p in ['auto', 'top', 'side'] as const" :key="p" size="slim" :pressed="placement === p" @click="placement = p">{{ p }}</QButton>
      </span>
      <span class="group" role="group" aria-label="Width">
        <span class="bar-label">Width</span>
        <QButton v-for="w in ['wide', 'narrow'] as const" :key="w" size="slim" :pressed="width === w" @click="width = w">{{ w }}</QButton>
      </span>
      <span class="group" role="group" aria-label="Density">
        <span class="bar-label">Density</span>
        <QButton v-for="d in ['comfortable', 'compact'] as const" :key="d" size="slim" :pressed="density === d" @click="density = d">{{ d }}</QButton>
      </span>
    </div>
    <div :class="['frame', `frame--${width}`]">
      <QForm :label-placement="placement" :density="density" :errors="summary" @submit.prevent="submit">
        <QFormSection title="Product details">
          <QField id="p-title" label="Title" required :error="errors.title" hint="Shown on the product page and in search results.">
            <QInput v-model="values.title" placeholder="e.g. Linen shirt, blue" />
          </QField>
          <QField
            id="p-sku"
            label="SKU"
            width="m"
            readonly
            help="Your own article number. It appears on packing slips and invoices, not in the shop."
            hint="Generated from the product type and variant."
          >
            <QInput v-model="values.sku" numeric />
          </QField>
        </QFormSection>
        <QFormSection title="Pricing" description="Prices include VAT.">
          <QFieldGroup :columns="[1, 1]">
            <QField
              id="p-price"
              label="Price"
              required
              :error="errors.price"
              :warning="belowCost ? `This is below the cost of ${values.cost} € — you lose money on every sale.` : null"
            >
              <QInput v-model="values.price" suffix="€" numeric align="end" inputmode="decimal" />
            </QField>
            <QField id="p-compare" label="Compare-at price" :error="errors.compare" help="The original price, shown struck through next to the price when the product is on sale.">
              <QInput v-model="values.compare" suffix="€" numeric align="end" inputmode="decimal" />
            </QField>
          </QFieldGroup>
          <QField id="p-cost" label="Cost per item" width="s" hint="Customers don’t see this.">
            <QInput v-model="values.cost" suffix="€" numeric align="end" inputmode="decimal" />
          </QField>
          <QField id="p-code" label="Discount code" width="m" :success="values.code === 'AUTUMN10' ? 'Code is active: 10% off until 31 October' : null">
            <QInput v-model="values.code" />
          </QField>
        </QFormSection>
        <QFormSection title="Shipping">
          <QFieldGroup label="Dimensions" required :error="errors.dims" :columns="[1, 1, 1]" stack="late">
            <QField id="p-length" label="Length"><QInput v-model="values.length" suffix="cm" numeric align="end" inputmode="decimal" /></QField>
            <QField id="p-width" label="Width">
              <QInput v-model="values.width" suffix="cm" numeric align="end" inputmode="decimal" :invalid="!!errors.dims && !values.width" />
            </QField>
            <QField id="p-height" label="Height"><QInput v-model="values.height" suffix="cm" numeric align="end" inputmode="decimal" /></QField>
          </QFieldGroup>
          <QField id="p-origin" label="Country of origin" width="m" disabled hint="Set by the supplier. Ask them to change it.">
            <QInput v-model="values.origin" />
          </QField>
        </QFormSection>
        <QFormActions align="between">
          <QButton variant="danger-outline">Delete product</QButton>
          <div class="right">
            <span class="saved" role="status">{{ saved ? 'Saved' : '' }}</span>
            <QButton>Cancel</QButton>
            <QButton variant="primary" type="submit">Save</QButton>
          </div>
        </QFormActions>
      </QForm>
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-4); }
.bar { display: flex; flex-wrap: wrap; gap: var(--space-4); align-items: center; padding-bottom: var(--space-4); border-bottom: 1px solid var(--line); }
.group { display: inline-flex; align-items: center; gap: var(--space-1); }
.bar-label { margin-right: var(--space-1); font: var(--text-caption); color: var(--ink-muted); }
.frame { transition: max-width 200ms ease; }
.frame--wide { max-width: 760px; }
.frame--narrow { max-width: 360px; }
.right { display: flex; align-items: center; gap: var(--space-2); }
.saved { font: var(--text-small); color: var(--success); }
</style>
