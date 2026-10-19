<!-- One action, usually Undo. A toast with an action stays for 8 seconds and pauses while hovered or focused. -->
<script setup lang="ts">
import { QButton, toast } from '@frederikhd/quiet';
import { ref } from 'vue';

const active = ref(3);

function archive() {
  active.value -= 1;
  toast('Archived 1 product', { action: { label: 'Undo', onClick: () => (active.value += 1) } });
}
</script>

<template>
  <div class="row">
    <QButton :disabled="active === 0" @click="archive">Archive product</QButton>
    <span class="count">{{ active }} active products</span>
  </div>
</template>

<style scoped>
.row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3); }
.count { color: var(--ink-muted); }
</style>
