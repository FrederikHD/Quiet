<script setup lang="ts">
import { QButton, QField, QFieldGroup, QForm, QFormActions, QInput, QSelect } from 'quiet';
import { reactive, ref } from 'vue';

const countries = [
  { label: 'Most common', options: ['Germany', 'Austria', 'Switzerland'] },
  { label: 'All countries', options: ['Belgium', 'Denmark', 'France', 'Italy', 'Netherlands', 'Poland', 'Spain'] },
];
const v = reactive({ country: '', shipping: 'standard', category: '', warehouse: 'Berlin', status: 'All statuses', sort: 'new', size: '', amount: '120,00', currency: 'EUR' });
const tried = ref(false);
</script>

<template>
  <div class="pv">
    <div class="col">
      <p class="pv-title">In Fields — press Check with no country</p>
      <QForm label-placement="top" markers="optional" @submit.prevent="tried = true">
        <QField label="Country" required :error="tried && !v.country ? 'Choose the country we deliver to' : null">
          <QSelect v-model="v.country" placeholder="Choose a country" :options="countries" autocomplete="country-name" />
        </QField>
        <QField label="Shipping method" hint="Standard takes 2–4 working days. Express arrives the next working day if ordered before 14:00.">
          <QSelect
            v-model="v.shipping"
            :options="[{ value: 'standard', label: 'Standard, free' }, { value: 'express', label: 'Express, 9,90 €' }, { value: 'pickup', label: 'Store pickup' }]"
          />
        </QField>
        <QField label="Category"><QSelect v-model="v.category" placeholder="No category" :options="['Shirts', 'Trousers', 'Knitwear']" /></QField>
        <QField label="Warehouse" disabled hint="Only one warehouse is set up."><QSelect v-model="v.warehouse" :options="['Berlin']" /></QField>
        <QFormActions align="start"><QButton type="submit">Check</QButton></QFormActions>
      </QForm>
    </div>
    <div class="col">
      <p class="pv-title">Back-office toolbar — slim, compact</p>
      <div class="bar" data-density="compact">
        <QSelect v-model="v.status" size="slim" aria-label="Filter by status" :options="['All statuses', 'Unfulfilled', 'Fulfilled', 'Shipped', 'Cancelled']" />
        <QSelect
          v-model="v.sort"
          size="slim"
          aria-label="Sort orders"
          prefix-icon="sliders"
          :options="[{ value: 'new', label: 'Newest first' }, { value: 'old', label: 'Oldest first' }, { value: 'total', label: 'Highest total' }]"
        />
      </div>
      <p class="pv-title">Storefront — large</p>
      <QField label="Size" label-placement="top">
        <QSelect v-model="v.size" size="large" placeholder="Select a size" required :options="['S', 'M', 'L', { value: 'XL', label: 'XL — sold out', disabled: true }]" />
      </QField>
      <p class="pv-title">Connected with an Input</p>
      <QForm label-placement="top">
        <QFieldGroup :columns="[3, 1]" connected>
          <QField label="Amount"><QInput v-model="v.amount" numeric align="end" inputmode="decimal" /></QField>
          <QField label="Currency"><QSelect v-model="v.currency" :options="['EUR', 'CHF', 'GBP']" /></QField>
        </QFieldGroup>
      </QForm>
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr)); gap: var(--space-8); align-items: start; }
.col { display: grid; gap: var(--field-gap); min-width: 0; }
.pv-title { margin: 0 0 var(--space-1); font: var(--text-caption); color: var(--ink-muted); }
.bar { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.bar > * { flex: 1 1 180px; min-width: 0; }
</style>
