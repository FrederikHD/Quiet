<!-- A flat list without group headings: finding an order in the back office by number or customer. -->
<script setup lang="ts">
import { QSearchBox, type SearchSuggestion } from '@frederikhd/quiet';
import { computed, ref } from 'vue';

const ORDERS = [
  { id: '#10530', customer: 'Anna Schmidt', total: '122,90 €' },
  { id: '#10529', customer: 'Noah Koch', total: '57,03 €' },
  { id: '#10528', customer: 'Lea Fischer', total: '94,16 €' },
];
const q = ref('');
const suggestions = computed<SearchSuggestion[]>(() => {
  const t = q.value.trim().toLowerCase();
  return t
    ? ORDERS.filter((o) => `${o.id} ${o.customer}`.toLowerCase().includes(t)).map((o) => ({
        label: `Order ${o.id}`,
        description: o.customer,
        icon: 'bag' as const,
        meta: o.total,
      }))
    : [];
});
</script>

<template>
  <div class="box" data-density="compact">
    <QSearchBox
      v-model="q"
      label="Search orders"
      placeholder="Order number or customer"
      :suggestions="suggestions"
      :search-option="false"
    />
  </div>
</template>

<style scoped>
.box {
  max-width: 360px;
}
</style>
