<script setup lang="ts">
import { QButton, QInput, QPopover } from 'quiet';
import { ref } from 'vue';

const sku = ref('LS-2041-BL-M');
const open = ref(false);
const status = ref('Unfulfilled');
const draft = ref('Unfulfilled');
const options = ['Unfulfilled', 'Fulfilled', 'Shipped', 'Cancelled'];
function apply() {
  status.value = draft.value;
  open.value = false;
}
</script>

<template>
  <div class="pv">
    <div>
      <p class="pv-title">kind="tip" — help next to a label</p>
      <div class="field" data-density="compact">
        <div class="labelrow">
          <label for="pv-sku">SKU</label>
          <span class="q-field__help">
            <QPopover kind="tip" label="Help: SKU" content="Your own article number. It appears on packing slips and invoices, not in the shop.">
              <QButton variant="ghost" size="slim" aria-label="Help: SKU" icon-start="help" />
            </QPopover>
          </span>
        </div>
        <QInput id="pv-sku" v-model="sku" numeric />
      </div>
    </div>
    <div data-density="compact">
      <p class="pv-title">kind="dialog" — a few controls</p>
      <QPopover v-model:open="open" label="Change order status" @update:open="(o) => o && (draft = status)">
        <QButton icon-end="chevron-down">Status: {{ status }}</QButton>
        <template #content>
          <div class="status" data-density="compact">
            <p class="status-head">Order #1049</p>
            <div class="options" role="group" aria-label="Status">
              <QButton v-for="opt in options" :key="opt" variant="ghost" :pressed="draft === opt" @click="draft = opt">{{ opt }}</QButton>
            </div>
            <div class="actions">
              <QButton @click="open = false">Cancel</QButton>
              <QButton variant="primary" @click="apply">Apply</QButton>
            </div>
          </div>
        </template>
      </QPopover>
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr)); gap: var(--space-8); align-items: start; }
.pv-title { margin: 0 0 var(--space-3); font: var(--text-caption); color: var(--ink-muted); }
.labelrow { display: flex; align-items: center; gap: var(--space-1); margin-bottom: var(--space-1); font: var(--text-label); }
.field { width: 220px; max-width: 100%; }
.status { display: grid; gap: var(--space-2); }
.status-head { margin: 0 0 var(--space-1); font: var(--text-label); font-weight: 600; }
.options { display: grid; gap: var(--space-1); }
.options :deep(.q-btn) { justify-content: flex-start; }
.actions { display: flex; justify-content: flex-end; gap: var(--space-2); margin-top: var(--space-2); }
</style>
