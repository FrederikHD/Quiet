<script setup lang="ts">
import { QCheckbox } from 'quiet';
import { ref } from 'vue';

const checked = ref(true);
const described = ref(true);
const card = ref(true);
const compact = ref(true);
</script>

<template>
  <div class="col">
    <QCheckbox label="Unchecked" />
    <QCheckbox v-model="checked" label="Checked" />
    <QCheckbox label="Indeterminate (some of the items below)" indeterminate />
    <QCheckbox label="Invalid" invalid />
    <QCheckbox label="Disabled" disabled />
    <QCheckbox label="Disabled, checked" disabled :model-value="true" />
    <QCheckbox v-model="described" label="With a description" description="One line in ink-muted under the label" />
    <QCheckbox label="With meta" meta="3,50 €" />
    <QCheckbox v-model="card" card label="As a card" description="Bordered tile; the ticked one turns brand" meta="2,00 €" />
    <div data-density="compact">
      <p class="pv-title">Compact</p>
      <QCheckbox v-model="compact" label="Compact checked" />
      <QCheckbox label="Compact unchecked" />
    </div>
  </div>
</template>

<style scoped>
.col { display: grid; gap: var(--space-1); max-width: 420px; }
.pv-title { margin: var(--space-4) 0 var(--space-1); font: var(--text-caption); color: var(--ink-muted); }
</style>
