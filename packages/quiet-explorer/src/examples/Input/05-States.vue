<!-- Invalid shows a red border (the message comes from Field), read-only stays copyable, disabled can't be used at all. -->
<script setup lang="ts">
import { QInput } from 'quiet';
import { reactive } from 'vue';

const values = reactive({ email: 'anna@example', order: 'ORD-2026-01049', weight: '1,2' });
</script>

<template>
  <div class="stack">
    <QInput v-model="values.email" aria-label="Email" type="email" invalid />
    <QInput v-model="values.order" aria-label="Order number" readonly numeric />
    <QInput v-model="values.weight" aria-label="Weight" suffix="kg" disabled />
  </div>
</template>

<style scoped>
.stack { display: grid; gap: var(--space-3); max-width: 320px; }
</style>
