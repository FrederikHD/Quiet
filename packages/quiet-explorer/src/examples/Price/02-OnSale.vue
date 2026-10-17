<!-- Above the amount, compare-at turns it into a sale; screen readers hear "Sale price" and "Original price". -->
<script setup lang="ts">
import { QPrice } from 'quiet';
</script>

<template>
  <QPrice :amount="59" :compare-at="79" />
</template>
