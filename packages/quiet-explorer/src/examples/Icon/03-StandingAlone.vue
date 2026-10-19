<!-- An icon that carries meaning on its own gets a label: it becomes an image named "In stock" or "Sold out". -->
<script setup lang="ts">
import { QIcon } from '@frederikhd/quiet';

const stock = [
  { name: 'Linen shirt, blue', available: true },
  { name: 'Linen trousers, sand', available: false },
  { name: 'Linen dress, natural', available: true },
];
</script>

<template>
  <ul class="list">
    <li v-for="p in stock" :key="p.name">
      {{ p.name }}
      <QIcon v-if="p.available" name="check-circle" size="sm" label="In stock" class="ok" />
      <QIcon v-else name="x" size="sm" label="Sold out" class="muted" />
    </li>
  </ul>
</template>

<style scoped>
.list { display: grid; max-width: 320px; margin: 0; padding: 0; list-style: none; }
.list li { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); padding: var(--space-2) 0; border-bottom: 1px solid var(--line); }
.ok { color: var(--success); }
.muted { color: var(--ink-muted); }
</style>
