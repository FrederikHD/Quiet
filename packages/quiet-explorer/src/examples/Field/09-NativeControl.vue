<!-- For a control that isn't Quiet's, bind the slot's controlAttrs to get the id, aria-describedby and aria-required. -->
<script setup lang="ts">
import { QField } from 'quiet';
import { ref } from 'vue';

const date = ref('2026-10-24');
</script>

<template>
  <QField v-slot="{ controlAttrs }" label="Delivery date" label-placement="top" hint="We deliver Monday to Saturday.">
    <input v-model="date" v-bind="controlAttrs" type="date" class="date" />
  </QField>
</template>

<style scoped>
.date { justify-self: start; height: var(--ctl-h); padding: 0 var(--space-3); border: 1px solid var(--line-strong); border-radius: var(--radius-md); background: var(--surface-raised); color: var(--ink); font: inherit; }
</style>
