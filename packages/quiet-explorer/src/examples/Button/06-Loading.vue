<!-- While the action runs, the button shows a spinner, keeps its width and can't be clicked twice. -->
<script setup lang="ts">
import { QButton } from '@frederikhd/quiet';
import { ref } from 'vue';

const saving = ref(false);
const saved = ref(false);
function save() {
  saving.value = true;
  saved.value = false;
  setTimeout(() => {
    saving.value = false;
    saved.value = true;
  }, 1500);
}
</script>

<template>
  <div class="row">
    <QButton variant="primary" :loading="saving" @click="save">Save changes</QButton>
    <span class="log" role="status">{{ saved ? 'Saved.' : '' }}</span>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}
.log {
  font: var(--text-small);
  color: var(--ink-muted);
}
</style>
