<!-- width="narrow" (720px) for settings and single-column forms; one form on a narrow page needs no card. -->
<script setup lang="ts">
import { QButton, QField, QForm, QFormActions, QInput, QPage } from 'quiet';
import { reactive } from 'vue';

const store = reactive({ name: 'Leinen & Co', email: 'hallo@leinen.example' });
</script>

<template>
  <div class="frame">
    <QPage title="Store details" width="narrow" :back="{ href: '#settings', label: 'Settings' }">
      <QForm label-placement="top" @submit.prevent>
        <QField label="Store name" required><QInput v-model="store.name" /></QField>
        <QField label="Contact email" required><QInput v-model="store.email" type="email" autocomplete="email" /></QField>
        <QFormActions><QButton variant="primary" type="submit">Save</QButton></QFormActions>
      </QForm>
    </QPage>
  </div>
</template>

<style scoped>
.frame { border: 1px solid var(--line); border-radius: var(--radius-md); background: var(--surface); }
</style>
