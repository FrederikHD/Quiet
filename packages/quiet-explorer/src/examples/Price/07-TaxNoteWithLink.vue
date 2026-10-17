<!-- The tax-note slot takes your own wording, with a link to the shipping costs. -->
<script setup lang="ts">
import { QPrice } from 'quiet';
</script>

<template>
  <QPrice :amount="99" size="large">
    <template #tax-note>incl. VAT, plus <a href="#shipping">shipping</a></template>
  </QPrice>
</template>
