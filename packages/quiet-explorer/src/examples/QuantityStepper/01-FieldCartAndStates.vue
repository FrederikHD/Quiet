<script setup lang="ts">
import { QField, QForm, QQuantityStepper } from 'quiet';
import { ref } from 'vue';

const qty = ref(1);
const cart = ref(2);
const large = ref(1);
const tooMany = ref(5);
const off = ref(1);
</script>

<template>
  <div class="pv">
    <div>
      <p class="pv-title">In a field, 1–10</p>
      <QForm label-placement="top">
        <QField label="Quantity" hint="Up to 10 per order."><QQuantityStepper v-model="qty" :min="1" :max="10" /></QField>
      </QForm>
      <p class="log">Value: {{ qty }}</p>
    </div>
    <div>
      <p class="pv-title">Cart line — 0 allowed, the app removes the line</p>
      <div class="row">
        <span>Linen shirt, navy</span>
        <QQuantityStepper v-model="cart" aria-label="Quantity of Linen shirt, navy" :min="0" :max="5" />
      </div>
      <p class="log">{{ cart === 0 ? 'Removed from cart' : `${cart} in cart` }}</p>
    </div>
    <div><p class="pv-title">Large — product page</p><QQuantityStepper v-model="large" size="large" aria-label="Quantity" /></div>
    <div>
      <p class="pv-title">With an error</p>
      <QForm label-placement="top">
        <QField label="Quantity" error="Only 3 left in stock"><QQuantityStepper v-model="tooMany" :max="9" /></QField>
      </QForm>
    </div>
    <div><p class="pv-title">Disabled</p><QQuantityStepper v-model="off" aria-label="Quantity" disabled /></div>
  </div>
</template>

<style scoped>
.pv { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr)); gap: var(--space-6) var(--space-8); }
.pv-title { margin: 0 0 var(--space-2); font: var(--text-caption); color: var(--ink-muted); }
.log { margin: var(--space-2) 0 0; font: var(--text-small); color: var(--ink-muted); }
.row { display: flex; align-items: center; gap: var(--space-3); }
</style>
