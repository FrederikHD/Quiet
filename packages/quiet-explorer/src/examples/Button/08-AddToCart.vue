<!-- On the product page, Add to cart is large and as wide as its column, with Save to wishlist under it. -->
<script setup lang="ts">
import { QButton } from '@frederikhd/quiet';
</script>

<template>
  <div class="buy">
    <QButton variant="primary" size="large" icon-start="cart" full-width>Add to cart</QButton>
    <QButton size="large" icon-start="heart" full-width>Save to wishlist</QButton>
  </div>
</template>

<style scoped>
.buy {
  display: grid;
  gap: var(--space-2);
  max-width: 320px;
}
</style>
