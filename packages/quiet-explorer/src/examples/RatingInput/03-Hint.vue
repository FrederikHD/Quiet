<!-- A hint under the stars says what to rate. -->
<script setup lang="ts">
import { QRatingInput } from '@frederikhd/quiet';
import { ref } from 'vue';

const rating = ref(0);
</script>

<template>
  <QRatingInput v-model="rating" label="Your rating" hint="Rate the fabric and the fit, not the delivery." />
</template>
