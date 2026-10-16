<script setup lang="ts">
import { QButton, toast } from 'quiet';
import { ref } from 'vue';

// The explorer's AppShell already has a Toaster, so toast() works from anywhere here.
const active = ref(3);
function archive() {
  active.value -= 1;
  toast('Archived 1 product', { action: { label: 'Undo', onClick: () => (active.value += 1) } });
}
</script>

<template>
  <div class="pv">
    <div class="row">
      <QButton @click="toast('Product saved')">Save product</QButton>
      <QButton @click="archive">Archive product</QButton>
      <QButton variant="danger-outline" @click="toast('Couldn’t save — check your connection and try again.', { tone: 'error' })">Fail to save</QButton>
    </div>
    <p class="note">{{ active }} active products. Toasts appear at the top and never take focus; hover or focus one to keep it open.</p>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-4); }
.row { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.note { margin: 0; font: var(--text-small); color: var(--ink-muted); }
</style>
