<!-- Stacked disclosures form an accordion for product details; each opens on its own. -->
<script setup lang="ts">
import { QDisclosure } from 'quiet';
</script>

<template>
  <div class="details">
    <QDisclosure title="Material and care">
      <p>100 % linen from the Rhön. Machine washable at 30 °C, hang to dry.</p>
    </QDisclosure>
    <QDisclosure title="Fit">
      <p>Relaxed fit. Our model is 1,82 m tall and wears size M.</p>
    </QDisclosure>
    <QDisclosure title="Sustainability">
      <p>Woven and sewn in Germany, dyed without azo dyes.</p>
    </QDisclosure>
  </div>
</template>

<style scoped>
.details { max-width: 420px; }
p { margin: 0; }
</style>
