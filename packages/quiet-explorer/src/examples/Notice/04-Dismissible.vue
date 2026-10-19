<!-- dismissible adds a × that emits dismiss; remove the notice when it's pressed. -->
<script setup lang="ts">
import { QButton, QNotice } from '@frederikhd/quiet';
import { ref } from 'vue';

const show = ref(true);
</script>

<template>
  <QNotice v-if="show" title="New: edit prices in bulk" dismissible @dismiss="show = false">
    Select products in the list, then choose Edit prices.
  </QNotice>
  <QButton v-else variant="ghost" @click="show = true">Show the notice again</QButton>
</template>
