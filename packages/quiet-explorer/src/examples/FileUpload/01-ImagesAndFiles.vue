<script setup lang="ts">
import { QField, QFileUpload, QForm, type FileUploadItem } from 'quiet';
import { ref } from 'vue';
import { tile } from '../../fixtures/pictures';

const images = ref<FileUploadItem[]>([
  { key: 'a', name: 'linen-shirt-blue-front.jpg', size: 284000, url: tile(210) },
  { key: 'b', name: 'linen-shirt-blue-back.jpg', size: 251000, url: tile(200) },
]);
const docs = ref<FileUploadItem[]>([]);
</script>

<template>
  <div class="pv">
    <QForm label-placement="top">
      <QField label="Images" hint="JPG, PNG, WebP or GIF, up to 10 MB each. The first image is the one shown in lists.">
        <QFileUpload v-model="images" variant="images" :max-size="10 * 1048576" :max-files="8" />
      </QField>
    </QForm>
    <QForm label-placement="top">
      <QField label="Certificate" hint="One PDF, up to 5 MB.">
        <QFileUpload v-model="docs" accept=".pdf,application/pdf" accept-label="a PDF" :multiple="false" :max-size="5 * 1048576" />
      </QField>
      <QField label="Size chart" disabled hint="Available once the product is saved."><QFileUpload /></QField>
    </QForm>
  </div>
</template>

<style scoped>
.pv { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr)); gap: var(--space-8); align-items: start; }
</style>
