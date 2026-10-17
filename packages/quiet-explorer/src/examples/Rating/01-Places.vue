<script setup lang="ts">
import { QRating } from 'quiet';
</script>

<template>
  <div class="pv">
    <div><p class="pv-title">Under the product title (a link to the reviews)</p><QRating :value="4.3" :count="31" href="#reviews" @click="(e) => e.preventDefault()" /></div>
    <div><p class="pv-title">On a product card</p><QRating :value="3.6" :count="128" size="small" /></div>
    <div><p class="pv-title">On a review</p><QRating :value="4" :show-value="false" size="small" /></div>
    <div><p class="pv-title">None yet</p><QRating :value="0" :count="0" href="#reviews" @click="(e) => e.preventDefault()" /></div>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-4); justify-items: start; }
.pv-title { margin: 0 0 var(--space-1); font: var(--text-caption); color: var(--ink-muted); }
</style>
