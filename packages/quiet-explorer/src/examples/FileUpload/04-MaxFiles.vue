<!-- With maxFiles reached, the add button is disabled until an image is removed. -->
<script setup lang="ts">
import { QField, QFileUpload, type FileUploadItem } from 'quiet';
import { ref } from 'vue';
import { photo } from '../../fixtures/pictures';

const images = ref<FileUploadItem[]>(
  ['Sand', 'Olive', 'Rust'].map((c) => ({ key: c, name: `linen-cushion-${c.toLowerCase()}.jpg`, url: photo(c, 2) })),
);
</script>

<template>
  <QField label="Colour images" label-placement="top" hint="Up to 3 images, one per colour.">
    <QFileUpload v-model="images" variant="images" :max-files="3" />
  </QField>
</template>
