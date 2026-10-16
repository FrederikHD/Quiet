<script setup lang="ts">
import { QButton, QFormActions } from 'quiet';
</script>

<template>
  <div class="pv">
    <div class="box">
      <p class="pv-title">align="end"</p>
      <QFormActions><QButton>Cancel</QButton><QButton variant="primary">Save</QButton></QFormActions>
    </div>
    <div class="box">
      <p class="pv-title">align="between"</p>
      <QFormActions align="between">
        <QButton variant="danger-outline">Delete product</QButton>
        <div class="right"><QButton>Cancel</QButton><QButton variant="primary">Save</QButton></div>
      </QFormActions>
    </div>
    <div class="narrow">
      <p class="pv-title">Under 480px — stacked, primary on top</p>
      <QFormActions><QButton size="large">Back to cart</QButton><QButton variant="primary" size="large">Continue to payment</QButton></QFormActions>
    </div>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-6); }
.pv-title { margin: 0 0 var(--space-2); font: var(--text-caption); color: var(--ink-muted); }
.box { max-width: 640px; }
.narrow { max-width: 340px; }
.right { display: flex; gap: var(--space-2); }
</style>
