<!-- One customer's rating: just the stars, small; screen readers still hear "Rated 4 out of 5". -->
<script setup lang="ts">
import { QRating } from 'quiet';
</script>

<template>
  <div><QRating :value="4" :show-value="false" size="small" /></div>
</template>
