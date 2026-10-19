<!-- When the variants cost different amounts, show the cheapest with "from". -->
<script setup lang="ts">
import { QPrice } from '@frederikhd/quiet';
</script>

<template>
  <QPrice :amount="29" from />
</template>
