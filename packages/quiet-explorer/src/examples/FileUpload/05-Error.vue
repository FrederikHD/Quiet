<!-- The Field's error turns the drop zone's border red. -->
<script setup lang="ts">
import { QField, QFileUpload, type FileUploadItem } from '@frederikhd/quiet';
import { ref } from 'vue';

const images = ref<FileUploadItem[]>([]);
</script>

<template>
  <QField
    label="Images"
    label-placement="top"
    required
    :error="images.length ? null : 'Add at least one image to publish the product'"
  >
    <QFileUpload v-model="images" variant="images" />
  </QField>
</template>
