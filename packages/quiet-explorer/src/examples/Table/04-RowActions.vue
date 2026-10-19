<!-- One or two slim ghost icon buttons in the last column, each named after its row. -->
<script setup lang="ts">
import { QButton, QTable } from '@frederikhd/quiet';
import { ref } from 'vue';

const discounts = [
  { code: 'LINEN10', value: '−10 %', used: 214 },
  { code: 'WELCOME5', value: '−5,00 €', used: 88 },
  { code: 'SUMMER26', value: '−15 %', used: 0 },
];
const log = ref('');
</script>

<template>
  <QTable
    caption="Discount codes"
    row-key="code"
    :rows="discounts"
    :columns="[
      { key: 'code', header: 'Code' },
      { key: 'value', header: 'Discount', numeric: true },
      { key: 'used', header: 'Used', numeric: true },
    ]"
  >
    <template #row-actions="{ row }">
      <QButton
        size="slim"
        variant="ghost"
        icon-start="copy"
        :aria-label="`Copy ${row.code}`"
        @click="log = `Copied ${row.code}`"
      />
      <QButton
        size="slim"
        variant="ghost"
        icon-start="trash"
        :aria-label="`Delete ${row.code}`"
        @click="log = `Deleted ${row.code}`"
      />
    </template>
  </QTable>
  <p class="log" role="status">{{ log }}</p>
</template>

<style scoped>
.log {
  margin: 0;
  min-height: 18px;
  font: var(--text-small);
  color: var(--ink-muted);
}
</style>
