<!-- tone="success" adds a check icon, for a result that matters a little more than a save. -->
<script setup lang="ts">
import { QButton, toast } from 'quiet';
</script>

<template>
  <div>
    <QButton icon-start="truck" @click="toast('Order #10530 fulfilled', { tone: 'success' })">Fulfil order</QButton>
  </div>
</template>
