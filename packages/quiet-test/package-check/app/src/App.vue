<script setup lang="ts">
// What an app does with the published package: global components from app.use(Quiet), named imports, types.
import { QTable, money, toast, type TableColumn } from '@frederikhd/quiet';
import { ref } from 'vue';

const email = ref('');
const rows = [{ id: '#10500', total: 19.9 }];
const columns: TableColumn<(typeof rows)[number]>[] = [
  { key: 'id', header: 'Order' },
  { key: 'total', header: 'Total', numeric: true, format: (r) => money(r.total) },
];
</script>

<template>
  <QField label="Email"><QInput v-model="email" type="email" /></QField>
  <QButton variant="primary" @click="toast('Saved')">Save</QButton>
  <!-- The global types must be live: a variant that doesn't exist is a type error. -->
  <!-- @vue-expect-error -->
  <QButton variant="nope">Wrong</QButton>
  <QTable caption="Orders" :columns="columns" :rows="rows" />
  <QToaster />
</template>
