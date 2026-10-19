<!-- Apply a code (try LINEN10 or FREESHIP, or a wrong one); applied codes show as tags you can remove. -->
<script setup lang="ts">
import { QDiscountCode } from '@frederikhd/quiet';
import { ref } from 'vue';

const OFFERS: Record<string, string> = { LINEN10: '−10 %', FREESHIP: 'Free shipping' };
const codes = ref<string[]>([]);

// Your check goes here: return nothing when the code works, or the message why not.
function apply(code: string) {
  return new Promise<string | void>((resolve) =>
    setTimeout(() => {
      const key = code.toUpperCase();
      if (!OFFERS[key]) return resolve(`“${code}” isn’t a valid code`);
      codes.value = [...codes.value, key];
      resolve();
    }, 400),
  );
}
</script>

<template>
  <QDiscountCode
    :applied="codes.map((code) => ({ code, label: OFFERS[code] }))"
    :apply="apply"
    class="discount"
    @remove="(code) => (codes = codes.filter((c) => c !== code))"
  />
</template>

<style scoped>
.discount {
  max-width: 420px;
}
</style>
