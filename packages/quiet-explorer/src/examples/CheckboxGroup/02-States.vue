<script setup lang="ts">
import { QCheckbox, QCheckboxGroup, QForm } from 'quiet';
</script>

<template>
  <div class="pv">
    <QForm label-placement="top">
      <QCheckboxGroup label="Return reasons" required error="Choose at least one reason">
        <QCheckbox value="size" label="Doesn’t fit" />
        <QCheckbox value="damaged" label="Arrived damaged" />
      </QCheckboxGroup>
      <QCheckboxGroup label="Discount applies to" warning="Sale items are already reduced by 30%" :default-value="['full', 'sale']">
        <QCheckbox value="full" label="Full-price items" />
        <QCheckbox value="sale" label="Sale items" />
      </QCheckboxGroup>
      <QCheckboxGroup label="Channels" disabled :default-value="['web']" hint="Set by your plan.">
        <QCheckbox value="web" label="Online store" />
        <QCheckbox value="pos" label="Point of sale" />
      </QCheckboxGroup>
    </QForm>
    <div data-density="compact">
      <p class="pv-title">Compact</p>
      <QForm label-placement="top">
        <QCheckboxGroup label="Show columns" layout="inline" :default-value="['sku', 'stock']">
          <QCheckbox value="sku" label="SKU" />
          <QCheckbox value="stock" label="Stock" />
          <QCheckbox value="price" label="Price" />
          <QCheckbox value="vendor" label="Vendor" />
        </QCheckboxGroup>
      </QForm>
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-4); max-width: 480px; }
.pv-title { margin: 0 0 var(--space-1); font: var(--text-caption); color: var(--ink-muted); }
</style>
