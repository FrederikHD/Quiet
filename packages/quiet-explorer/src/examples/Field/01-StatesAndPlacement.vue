<script setup lang="ts">
import { QField, QInput } from 'quiet';
import { ref } from 'vue';

const v = ref({ email: '', wrongEmail: 'anna@example', stock: '4', postcode: '10115', order: 'ORD-2026-01049', vat: '', title: 'Linen shirt, blue', price: '' });
</script>

<template>
  <div class="pv">
    <div class="col">
      <p class="pv-title">Label on top</p>
      <QField label="Email" required label-placement="top" hint="We send the order confirmation here.">
        <QInput v-model="v.email" type="email" autocomplete="email" placeholder="name@example.com" />
      </QField>
      <QField label="Email" required label-placement="top" error="Enter an email address in the format name@example.com">
        <QInput v-model="v.wrongEmail" type="email" />
      </QField>
      <QField label="Stock" label-placement="top" width="s" warning="Below the reorder level of 10">
        <QInput v-model="v.stock" numeric align="end" inputmode="numeric" suffix="pcs" />
      </QField>
    </div>
    <div class="col">
      <p class="pv-title">More states</p>
      <QField label="Postcode" label-placement="top" width="s" success="Address found: 10115 Berlin" markers="optional" required>
        <QInput v-model="v.postcode" numeric inputmode="numeric" autocomplete="postal-code" />
      </QField>
      <QField label="Order number" label-placement="top" width="m" readonly help="Created when the order is placed. Quote it in emails to customer service.">
        <QInput v-model="v.order" numeric />
      </QField>
      <QField label="Company VAT ID" label-placement="top" markers="optional" disabled hint="Only for business accounts.">
        <QInput v-model="v.vat" placeholder="DE123456789" />
      </QField>
    </div>
    <div class="side">
      <p class="pv-title">Label beside (side placement)</p>
      <QField label="Product title" required label-placement="side" hint="Shown on the product page and in search results.">
        <QInput v-model="v.title" />
      </QField>
      <QField label="Price" required label-placement="side" width="s" error="Enter a price, like 49,90" help="The price customers pay, including VAT.">
        <QInput v-model="v.price" suffix="€" numeric align="end" inputmode="decimal" />
      </QField>
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr)); gap: var(--space-8); align-items: start; }
.col { display: grid; gap: var(--field-gap); }
.pv-title { margin: 0 0 var(--space-1); font: var(--text-caption); color: var(--ink-muted); }
.side { grid-column: 1 / -1; display: grid; gap: var(--field-gap); max-width: 640px; padding-top: var(--space-4); border-top: 1px solid var(--line); }
</style>
