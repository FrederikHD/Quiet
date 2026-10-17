<!-- A problem with the combination goes on the group: its error marks every field in it and is read with each one. -->
<script setup lang="ts">
import { QField, QFieldGroup, QForm, QInput } from 'quiet';
import { reactive } from 'vue';

const values = reactive({ starts: '20.10.2026', ends: '12.10.2026' });
</script>

<template>
  <QForm label-placement="side">
    <QFieldGroup
      label="Sale period"
      required
      error="The end date must be after the start date"
      help="The sale price applies from the start of the first day to the end of the last."
    >
      <QField label="Starts"><QInput v-model="values.starts" /></QField>
      <QField label="Ends"><QInput v-model="values.ends" /></QField>
    </QFieldGroup>
  </QForm>
</template>
