<!-- label renames the field, here for gift cards; a code without a label shows on its own in the tag. -->
<script setup lang="ts">
import { QDiscountCode } from '@frederikhd/quiet';
import { ref } from 'vue';

const cards = ref<string[]>([]);

function apply(code: string) {
  if (!/^GC-\d{4}$/i.test(code)) return 'Gift card numbers look like GC-1234';
  cards.value = [...cards.value, code.toUpperCase()];
}
</script>

<template>
  <QDiscountCode
    label="Gift card number"
    :applied="cards.map((code) => ({ code }))"
    :apply="apply"
    class="discount"
    @remove="(code) => (cards = cards.filter((c) => c !== code))"
  />
</template>

<style scoped>
.discount {
  max-width: 420px;
}
</style>
