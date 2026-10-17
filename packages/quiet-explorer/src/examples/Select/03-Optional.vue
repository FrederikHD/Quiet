<!-- On an optional Select the placeholder stays in the list as the "none" choice. -->
<script setup lang="ts">
import { QField, QSelect } from 'quiet';
import { ref } from 'vue';

const category = ref('');
</script>

<template>
  <QField label="Category" label-placement="top" width="m">
    <QSelect v-model="category" placeholder="No category" :options="['Shirts', 'Trousers', 'Knitwear']" />
  </QField>
</template>
