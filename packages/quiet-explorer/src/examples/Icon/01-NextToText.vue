<!-- An icon beside a word takes the text's colour and is hidden from screen readers, so nothing is read twice. -->
<script setup lang="ts">
import { QIcon } from '@frederikhd/quiet';
</script>

<template>
  <ul class="list">
    <li class="ok"><QIcon name="check-circle" />In stock, ships tomorrow</li>
    <li><QIcon name="truck" />Free delivery from 75,00 €</li>
    <li><QIcon name="refresh" />30 days to return</li>
  </ul>
</template>

<style scoped>
.list {
  display: grid;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.list li {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.ok {
  color: var(--success);
}
</style>
