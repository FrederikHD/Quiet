<!-- One checkbox with its label and a line of description. The whole row is the click target. -->
<script setup lang="ts">
import { QCheckbox } from '@frederikhd/quiet';
import { ref } from 'vue';

const newsletter = ref(true);
</script>

<template>
  <QCheckbox
    v-model="newsletter"
    label="Send me the newsletter"
    description="About once a month. Unsubscribe any time."
  />
</template>
