<!-- The stacked layout puts the term above the value, for narrow side columns. -->
<script setup lang="ts">
import { QCard, QDescriptionList } from '@frederikhd/quiet';
</script>

<template>
  <QCard title="Customer" :heading-level="3" class="narrow">
    <QDescriptionList
      layout="stacked"
      :items="[
        { term: 'Name', description: 'Anna Schmidt' },
        { term: 'Email', description: 'anna.schmidt@example.com' },
        { term: 'Customer since', description: 'March 2024 · 6 orders' },
      ]"
    />
  </QCard>
</template>

<style scoped>
.narrow {
  max-width: 300px;
}
</style>
