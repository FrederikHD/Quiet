<!-- label-hidden keeps the label for screen readers only, where the row makes it obvious. Table's selectable sets this up for you. -->
<script setup lang="ts">
import { QCheckbox } from 'quiet';
import { ref } from 'vue';

const orders = [
  { id: '#10421', customer: 'Anna Schmidt', total: '84,70 €' },
  { id: '#10420', customer: 'Jonas Weber', total: '129,00 €' },
];
const picked = ref<string[]>(['#10420']);

function toggle(id: string, on: boolean) {
  picked.value = on ? [...picked.value, id] : picked.value.filter((p) => p !== id);
}
</script>

<template>
  <ul class="orders">
    <li v-for="o in orders" :key="o.id" class="order">
      <QCheckbox label-hidden :label="`Select order ${o.id}`" :model-value="picked.includes(o.id)" @update:model-value="toggle(o.id, $event)" />
      <span>{{ o.id }}</span>
      <span class="customer">{{ o.customer }}</span>
      <span class="total">{{ o.total }}</span>
    </li>
  </ul>
</template>

<style scoped>
.orders { margin: 0; padding: 0; list-style: none; max-width: 420px; }
.order { display: flex; align-items: center; gap: var(--space-3); border-bottom: 1px solid var(--line); }
.customer { flex: 1; }
.total { font-variant-numeric: tabular-nums; }
</style>
