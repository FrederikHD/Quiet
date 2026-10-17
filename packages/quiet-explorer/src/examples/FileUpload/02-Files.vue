<!-- The default variant: a drop zone, then the added files with their size and a remove button. -->
<script setup lang="ts">
import { QField, QFileUpload, type FileUploadItem } from 'quiet';
import { ref } from 'vue';

const docs = ref<FileUploadItem[]>([{ key: 'care', name: 'care-instructions-linen.pdf', size: 182000 }]);
</script>

<template>
  <QField label="Product documents" label-placement="top" hint="PDFs up to 5 MB each: care instructions, certificates.">
    <QFileUpload v-model="docs" accept=".pdf,application/pdf" accept-label="a PDF" :max-size="5 * 1048576" />
  </QField>
</template>
