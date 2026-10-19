<!-- The average as stars and a number, with the number of reviews behind it. -->
<script setup lang="ts">
import { QRating } from '@frederikhd/quiet';
</script>

<template>
  <div><QRating :value="4.3" :count="31" /></div>
</template>
