<!-- On the product page: large, with the unit price German law asks for (here a 500 ml bottle) and the VAT note. -->
<script setup lang="ts">
import { QPrice } from '@frederikhd/quiet';
</script>

<template>
  <QPrice
    :amount="19.9"
    :compare-at="24"
    size="large"
    show-saving
    :unit-price="{ amount: 39.8, per: '1 l' }"
    tax-note
  />
</template>
