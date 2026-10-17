<!-- A description under the title, and the card's own button in a footer under a rule. -->
<script setup lang="ts">
import { QButton, QCard, QField, QFormActions, QInput } from 'quiet';
import { ref } from 'vue';

const note = ref('');
</script>

<template>
  <QCard title="Notes" description="Only your team sees these." class="card">
    <QField label="Note" label-hidden><QInput v-model="note" placeholder="Add a note" /></QField>
    <template #footer>
      <QFormActions><QButton size="slim" variant="primary">Save note</QButton></QFormActions>
    </template>
  </QCard>
</template>

<style scoped>
.card { max-width: 400px; }
</style>
