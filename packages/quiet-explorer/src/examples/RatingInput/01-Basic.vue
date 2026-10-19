<!-- Five stars to pick from: hover previews the level, and ← → choose like any radio group. -->
<script setup lang="ts">
import { QRatingInput } from '@frederikhd/quiet';
import { ref } from 'vue';

const stars = ref(4);
</script>

<template>
  <QRatingInput v-model="stars" label="Your rating" />
</template>
