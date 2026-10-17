<!-- kind="dialog" (the default) holds a few controls next to what they change; focus moves into the panel. -->
<script setup lang="ts">
import { QButton, QPopover } from 'quiet';
import { ref } from 'vue';

const options = ['Unfulfilled', 'Fulfilled', 'Shipped', 'Cancelled'];
const open = ref(false);
const status = ref('Unfulfilled');
const draft = ref(status.value);

function apply() {
  status.value = draft.value;
  open.value = false;
}
</script>

<template>
  <QPopover v-model:open="open" label="Change order status" @update:open="(o) => o && (draft = status)">
    <QButton icon-end="chevron-down">Status: {{ status }}</QButton>
    <template #content>
      <div class="panel" data-density="compact">
        <p class="head">Order #1049</p>
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
</template>

<style scoped>
.panel { display: grid; gap: var(--space-2); }
.head { margin: 0 0 var(--space-1); font: var(--text-label); font-weight: 600; }
.options { display: grid; gap: var(--space-1); }
.options :deep(.q-btn) { justify-content: flex-start; }
.actions { display: flex; justify-content: flex-end; gap: var(--space-2); margin-top: var(--space-2); }
</style>
