<!-- card turns the row into a bordered tile; the ticked one gets a brand border and tint. -->
<script setup lang="ts">
import { QCheckbox } from '@frederikhd/quiet';
import { reactive } from 'vue';

const extras = reactive({ insurance: true, express: false });
</script>

<template>
  <div class="list">
    <QCheckbox v-model="extras.insurance" card label="Shipping insurance" description="Covers loss and damage up to 500,00 €." meta="2,00 €" />
    <QCheckbox v-model="extras.express" card label="Express delivery" description="Next working day if ordered before 14:00." meta="9,90 €" />
  </div>
</template>

<style scoped>
.list { display: grid; gap: var(--space-2); max-width: 420px; }
</style>
