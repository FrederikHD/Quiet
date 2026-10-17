<!-- An Input inside a Field, which gives it its label and hint. -->
<script setup lang="ts">
import { QField, QInput } from 'quiet';
import { ref } from 'vue';

const title = ref('');
</script>

<template>
  <QField label="Product title" label-placement="top" hint="Shown on the product page and in search results.">
    <QInput v-model="title" placeholder="e.g. Linen shirt, blue" />
  </QField>
</template>
