<!-- count puts a number on the button: a bubble on an icon-only button, a pill after a label. Screen readers hear it with the name ("Cart, 3 items"). -->
<script setup lang="ts">
import { QButton } from '@frederikhd/quiet';
import { ref } from 'vue';

const items = ref(3);
const itemsLabel = (n: number) => (n === 1 ? '1 item' : `${n} items`);
</script>

<template>
  <div class="row">
    <QButton variant="ghost" icon-start="cart" aria-label="Cart" :count="items" :count-label="itemsLabel" />
    <QButton icon-start="bell" :count="12" :count-label="(n) => `${n} unread`">Notifications</QButton>
    <QButton variant="primary" :count="128">Review orders</QButton>
    <QButton size="slim" @click="items = items ? 0 : 3">{{ items ? 'Empty the cart' : 'Fill the cart' }}</QButton>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4);
}
</style>
