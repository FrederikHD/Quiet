<!-- On the product page: large, with the unit price German law asks for and the VAT note. -->
<script setup lang="ts">
import { QPrice } from 'quiet';
</script>

<template>
  <QPrice :amount="19.9" :compare-at="24" size="large" show-saving :unit-price="{ amount: 4.98, per: 'Stück' }" tax-note />
</template>
