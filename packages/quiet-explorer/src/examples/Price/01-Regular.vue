<!-- The amount, formatted for the shop's locale and currency: 59,00 €. -->
<script setup lang="ts">
import { QPrice } from 'quiet';
</script>

<template>
  <QPrice :amount="59" />
</template>
