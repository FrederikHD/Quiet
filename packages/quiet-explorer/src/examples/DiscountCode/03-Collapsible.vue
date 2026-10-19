<!-- In an order summary it starts as a quiet button, so customers without a code aren't sent looking for one. -->
<script setup lang="ts">
import { QDiscountCode } from '@frederikhd/quiet';
import { ref } from 'vue';

const codes = ref<string[]>([]);

function apply(code: string) {
  if (code.toUpperCase() !== 'FREESHIP') return `“${code}” isn’t a valid code`;
  codes.value = ['FREESHIP'];
}
</script>

<template>
  <QDiscountCode
    collapsible
    :applied="codes.map((code) => ({ code, label: 'Free shipping' }))"
    :apply="apply"
    class="discount"
    @remove="codes = []"
  />
</template>

<style scoped>
.discount { max-width: 420px; }
</style>
