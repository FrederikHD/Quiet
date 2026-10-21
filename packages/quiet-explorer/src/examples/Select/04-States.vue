<!-- With an error, read-only (still posted with the form) and disabled (the hint says why). -->
<script setup lang="ts">
import { QField, QForm, QSelect } from '@frederikhd/quiet';
import { reactive } from 'vue';

const values = reactive({ currency: 'EUR', warehouse: 'Berlin', reason: '' });
</script>

<template>
  <QForm label-placement="top">
    <QField label="Return reason" width="m" required error="Choose why the item came back">
      <QSelect
        v-model="values.reason"
        placeholder="Choose a reason"
        :options="['Too small', 'Too large', 'Damaged', 'Not as described']"
      />
    </QField>
    <QField label="Currency" width="s" readonly hint="Set for the whole shop."
      ><QSelect v-model="values.currency" name="currency" :options="['EUR']"
    /></QField>
    <QField label="Warehouse" width="m" disabled hint="Only one warehouse is set up."
      ><QSelect v-model="values.warehouse" :options="['Berlin']"
    /></QField>
  </QForm>
</template>
