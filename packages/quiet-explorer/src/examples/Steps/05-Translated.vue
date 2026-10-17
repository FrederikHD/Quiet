<!-- A German checkout: strings names the landmark, the finished state and the narrow counter. -->
<script setup lang="ts">
import { QSteps } from 'quiet';
</script>

<template>
  <QSteps
    :current="1"
    :steps="[{ label: 'Adresse' }, { label: 'Versand' }, { label: 'Zahlung' }]"
    :strings="{ label: 'Schritte zur Kasse', done: 'erledigt', step: (i, n) => `Schritt ${i} von ${n}` }"
  />
</template>
