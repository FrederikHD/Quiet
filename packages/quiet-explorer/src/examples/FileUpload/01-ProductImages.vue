<!-- Product images as thumbnails; the first one is the main image shown in lists and on cards. -->
<script setup lang="ts">
import { QField, QFileUpload, type FileUploadItem } from 'quiet';
import { ref } from 'vue';
import { photo } from '../../fixtures/pictures';

const images = ref<FileUploadItem[]>([
  { key: 'front', name: 'linen-shirt-blue-front.jpg', size: 284000, url: photo('Blue') },
  { key: 'back', name: 'linen-shirt-blue-back.jpg', size: 251000, url: photo('Blue', 1) },
]);
</script>

<template>
  <QField label="Images" label-placement="top" hint="JPG, PNG, WebP or GIF, up to 10 MB each.">
    <QFileUpload v-model="images" variant="images" :max-size="10 * 1048576" />
  </QField>
</template>
