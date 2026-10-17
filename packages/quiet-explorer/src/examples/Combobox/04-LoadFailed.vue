<!-- When search fails, the status line says so and offers Try again. Here the first request fails and the retry succeeds. -->
<script setup lang="ts">
import { QCombobox, QField, type ComboboxOption } from 'quiet';
import { ref } from 'vue';

const suppliers: ComboboxOption[] = [
  { value: 's1', label: 'Leinenweberei Rhön', description: 'Fulda' },
  { value: 's2', label: 'Flachs & Faden', description: 'Bielefeld' },
  { value: 's3', label: 'Lino Lusitano', description: 'Porto' },
];
let attempts = 0;

function searchSuppliers(query: string) {
  attempts++;
  return new Promise<ComboboxOption[]>((resolve, reject) =>
    setTimeout(() => (attempts === 1 ? reject(new Error('Network error')) : resolve(suppliers.filter((s) => s.label.toLowerCase().includes(query.toLowerCase())))), 400),
  );
}

const supplier = ref<ComboboxOption | null>(null);
</script>

<template>
  <QField label="Supplier" label-placement="top" width="l">
    <QCombobox v-model="supplier" placeholder="Choose a supplier" :search="searchSuppliers" />
  </QField>
</template>
