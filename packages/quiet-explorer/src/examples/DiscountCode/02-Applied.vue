<!-- A code already in use from the cart: the tag removes it, and a second code is refused. -->
<script setup lang="ts">
import { QDiscountCode } from '@frederikhd/quiet';
import { ref } from 'vue';

const codes = ref([{ code: 'LINEN10', label: '−10 %' }]);
</script>

<template>
  <QDiscountCode
    :applied="codes"
    :apply="() => 'Only one code can be used per order'"
    class="discount"
    @remove="(code) => (codes = codes.filter((c) => c.code !== code))"
  />
</template>

<style scoped>
.discount {
  max-width: 420px;
}
</style>
