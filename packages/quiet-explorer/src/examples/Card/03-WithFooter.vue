<!-- A description under the title, and the card's own button in a footer under a rule, on the right. -->
<script setup lang="ts">
import { QButton, QCard, QField, QInput } from '@frederikhd/quiet';
import { ref } from 'vue';

const note = ref('');
const status = ref('');

function save() {
  status.value = note.value.trim() ? 'Saved' : 'Nothing to save';
  if (note.value.trim()) note.value = '';
}
</script>

<template>
  <QCard title="Notes" description="Only your team sees these." class="card">
    <QField label="Note" label-hidden><QInput v-model="note" placeholder="Add a note" @input="status = ''" /></QField>
    <template #footer>
      <div class="footer">
        <p class="status" role="status">{{ status }}</p>
        <QButton size="slim" variant="primary" @click="save">Save note</QButton>
      </div>
    </template>
  </QCard>
</template>

<style scoped>
.card {
  max-width: 400px;
}
.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
}
.status {
  margin: 0;
  font: var(--text-small);
  color: var(--ink-muted);
}
</style>
