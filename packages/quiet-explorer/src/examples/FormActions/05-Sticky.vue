<!-- sticky keeps Cancel and Save at the bottom of a long edit screen; scroll the form. On phones it stays one row. -->
<script setup lang="ts">
import { QButton, QField, QForm, QFormActions, QInput, QTextarea } from '@frederikhd/quiet';
</script>

<template>
  <div class="screen">
    <QForm label-placement="top" class="form" @submit.prevent>
      <QField label="Title"><QInput model-value="Linen shirt, blue" /></QField>
      <QField label="Description"><QTextarea model-value="Washed linen from Lithuania, relaxed fit, mother-of-pearl buttons." :rows="4" /></QField>
      <QField label="Price"><QInput model-value="59,00" suffix="€" numeric align="end" /></QField>
      <QField label="SKU"><QInput model-value="LS-BLU-M" numeric /></QField>
      <QFormActions sticky>
        <QButton>Cancel</QButton>
        <QButton variant="primary" type="submit">Save</QButton>
      </QFormActions>
    </QForm>
  </div>
</template>

<style scoped>
.screen { max-width: 560px; height: 320px; overflow-y: auto; padding: 0 var(--space-4); border: 1px solid var(--line); border-radius: var(--radius-md); }
.form { padding-top: var(--space-4); }
</style>
