<!-- Under a filter heading that already says "Price", labelHidden keeps the name for screen readers only. -->
<script setup lang="ts">
import { QDisclosure, QPriceRange } from 'quiet';
import { ref } from 'vue';

const range = ref<[number, number]>([20, 120]);
</script>

<template>
  <QDisclosure title="Price" :meta="`${range[0]} € – ${range[1]} €`" default-open class="panel">
    <QPriceRange v-model="range" :min="20" :max="240" :step="10" label-hidden />
  </QDisclosure>
</template>

<style scoped>
.panel { max-width: 300px; }
</style>
