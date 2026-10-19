<!-- tone="error" is announced immediately and says how to fix it. Errors about what someone typed belong in the form instead. -->
<script setup lang="ts">
import { QButton, toast } from '@frederikhd/quiet';
</script>

<template>
  <div>
    <QButton @click="toast('Couldn’t save — check your connection and try again.', { tone: 'error' })">Save draft</QButton>
  </div>
</template>
