<!-- strings translates the label, the stars' names and the words for each level. -->
<script setup lang="ts">
import { QRatingInput } from '@frederikhd/quiet';
import { ref } from 'vue';

const stars = ref(5);
const strings = {
  yours: 'Deine Bewertung',
  stars: (n: number) => `${n} ${n === 1 ? 'Stern' : 'Sterne'}`,
  words: ['Schlecht', 'Geht so', 'Gut', 'Sehr gut', 'Hervorragend'],
};
</script>

<template>
  <QRatingInput v-model="stars" :strings="strings" />
</template>
