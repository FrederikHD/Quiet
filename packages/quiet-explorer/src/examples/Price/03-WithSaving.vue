<!-- show-saving adds a sale badge with the saving, read out as "20% off". -->
<script setup lang="ts">
import { QPrice } from 'quiet';
</script>

<template>
  <QPrice :amount="47.2" :compare-at="59" show-saving />
</template>
