<!-- A hint under the stars says what to rate. -->
<script setup lang="ts">
import { QRatingInput } from 'quiet';
import { ref } from 'vue';

const fit = ref(0);
</script>

<template>
  <QRatingInput v-model="fit" label="How does it fit?" hint="1 star runs small, 5 stars runs large." />
</template>
