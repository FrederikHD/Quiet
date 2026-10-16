<script setup lang="ts">
import { QButton, QCard, QField, QForm, QFormActions, QInput } from 'quiet';
import { ref } from 'vue';

const note = ref('');
const top = [
  ['Linen shirt, blue', '128 sold'],
  ['Linen trousers, sand', '94 sold'],
  ['Cotton tee, olive', '61 sold'],
];
</script>

<template>
  <div class="pv">
    <QCard>
      <div class="metric">4.210 €</div>
      <div class="label">Sales today</div>
    </QCard>
    <QCard title="Customer">
      <template #actions><QButton size="slim" variant="ghost">Edit</QButton></template>
      <div>Anna Schmidt</div>
      <div class="label">anna@example.com · 4 orders</div>
    </QCard>
    <QCard title="Notes" description="Only your team sees these.">
      <QForm label-placement="top">
        <QField label="Note" label-hidden><QInput v-model="note" placeholder="Add a note" /></QField>
      </QForm>
      <template #footer>
        <QFormActions align="end"><QButton size="slim" variant="primary">Save note</QButton></QFormActions>
      </template>
    </QCard>
    <QCard title="Top products" flush>
      <template #actions><QButton size="slim" variant="ghost" href="#products">View all</QButton></template>
      <ul class="list">
        <li v-for="[name, sold] in top" :key="name">{{ name }}<span>{{ sold }}</span></li>
      </ul>
    </QCard>
  </div>
</template>

<style scoped>
.pv { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr)); gap: var(--space-4); align-items: start; }
.metric { font: var(--text-metric); font-variant-numeric: tabular-nums; }
.label { font: var(--text-small); color: var(--ink-muted); }
.list { margin: 0; padding: 0; list-style: none; }
.list li { display: flex; justify-content: space-between; gap: var(--space-3); padding: var(--space-3) var(--panel-pad); border-top: 1px solid var(--line); }
.list li:first-child { border-top: 0; }
.list span { color: var(--ink-muted); font-variant-numeric: tabular-nums; }
</style>
