<!-- Just the stars, small, where there's no room for the number (a table row, a compact list); screen readers still hear "Rated 4,6 out of 5". One customer's review is a Review, which brings its own stars. -->
<script setup lang="ts">
import { QRating } from '@frederikhd/quiet';
</script>

<template>
  <div><QRating :value="4.6" :show-value="false" size="small" /></div>
</template>
