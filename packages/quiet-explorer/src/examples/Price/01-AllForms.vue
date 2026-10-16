<script setup lang="ts">
import { QPrice } from 'quiet';
</script>

<template>
  <div class="pv">
    <div><p class="pv-title">Regular</p><QPrice :amount="59" /></div>
    <div><p class="pv-title">On sale</p><QPrice :amount="59" :compare-at="79" /></div>
    <div><p class="pv-title">On sale, with the saving</p><QPrice :amount="47.2" :compare-at="59" show-saving /></div>
    <div><p class="pv-title">From — the cheapest variant</p><QPrice :amount="29" from /></div>
    <div><p class="pv-title">Product page: large, VAT note</p><QPrice :amount="99" size="large" tax-note /></div>
    <div>
      <p class="pv-title">Large, on sale, unit price</p>
      <QPrice :amount="19.9" :compare-at="24" size="large" show-saving :unit-price="{ amount: 4.98, per: 'Stück' }" tax-note />
    </div>
    <div><p class="pv-title">Small — in cards and the cart</p><QPrice :amount="35" size="small" /></div>
    <div><p class="pv-title">Small, on sale</p><QPrice :amount="24" :compare-at="35" size="small" /></div>
  </div>
</template>

<style scoped>
.pv { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr)); gap: var(--space-6) var(--space-8); }
.pv-title { margin: 0 0 var(--space-2); font: var(--text-caption); color: var(--ink-muted); }
</style>
