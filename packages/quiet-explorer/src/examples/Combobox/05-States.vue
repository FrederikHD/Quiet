<!-- With an error, read-only and disabled. -->
<script setup lang="ts">
import { QCombobox, QField, QForm, type ComboboxOption } from 'quiet';
import { ref } from 'vue';

const collections: ComboboxOption[] = [
  { value: 'summer', label: 'Summer linen' },
  { value: 'home', label: 'Home textiles' },
];
const suppliers: ComboboxOption[] = [{ value: 's1', label: 'Leinenweberei Rhön' }];
const warehouses: ComboboxOption[] = [{ value: 'ber', label: 'Berlin' }];

const collection = ref<ComboboxOption | null>(null);
const supplier = ref<ComboboxOption | null>(suppliers[0]);
const warehouse = ref<ComboboxOption | null>(warehouses[0]);
</script>

<template>
  <QForm label-placement="top">
    <QField label="Collection" required width="l" error="Choose a collection for the product">
      <QCombobox v-model="collection" placeholder="Choose a collection" :options="collections" />
    </QField>
    <QField label="Supplier" width="l" readonly hint="Set on the purchase order.">
      <QCombobox v-model="supplier" :options="suppliers" />
    </QField>
    <QField label="Warehouse" width="l" disabled hint="Only one warehouse is set up.">
      <QCombobox v-model="warehouse" :options="warehouses" />
    </QField>
  </QForm>
</template>
