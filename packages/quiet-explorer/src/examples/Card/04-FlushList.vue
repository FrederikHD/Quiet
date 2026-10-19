<!-- flush drops the body padding, so list rows reach the card's edges. -->
<script setup lang="ts">
import { QButton, QCard } from '@frederikhd/quiet';

const top = [
  ['Linen shirt, blue', '128 sold'],
  ['Linen trousers, sand', '94 sold'],
  ['Linen dress, natural', '61 sold'],
];
</script>

<template>
  <QCard title="Top products" flush class="card">
    <template #actions><QButton size="slim" variant="ghost" href="#products">View all</QButton></template>
    <ul class="list">
      <li v-for="[name, sold] in top" :key="name">{{ name }}<span>{{ sold }}</span></li>
    </ul>
  </QCard>
</template>

<style scoped>
.card { max-width: 400px; }
.list { margin: 0; padding: 0; list-style: none; }
.list li { display: flex; justify-content: space-between; gap: var(--space-3); padding: var(--space-3) var(--panel-pad); border-top: 1px solid var(--line); }
.list li:first-child { border-top: 0; }
.list span { color: var(--ink-muted); font-variant-numeric: tabular-nums; }
</style>
