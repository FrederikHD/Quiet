<!-- role="alertdialog" for a confirmation: the title asks, the description gives the consequence, and focus starts on Cancel. -->
<script setup lang="ts">
import { QButton, QDialog } from '@frederikhd/quiet';
import { ref } from 'vue';

const open = ref(false);
const log = ref('');

function remove() {
  open.value = false;
  log.value = 'Product deleted.';
}
</script>

<template>
  <div class="demo">
    <QButton variant="danger-outline" icon-start="trash" @click="open = true">Delete product</QButton>
    <p class="log" role="status">{{ log }}</p>

    <QDialog
      v-model:open="open"
      role="alertdialog"
      size="sm"
      title="Delete “Linen shirt, blue”?"
      description="It disappears from the shop and from 3 collections. Orders that include it keep it. This can’t be undone."
    >
      <template #footer>
        <QButton @click="open = false">Cancel</QButton>
        <QButton variant="danger" @click="remove">Delete product</QButton>
      </template>
    </QDialog>
  </div>
</template>

<style scoped>
.demo {
  display: grid;
  justify-items: start;
  gap: var(--space-3);
}
.log {
  margin: 0;
  min-height: 20px;
  font: var(--text-small);
  color: var(--ink-muted);
}
</style>
