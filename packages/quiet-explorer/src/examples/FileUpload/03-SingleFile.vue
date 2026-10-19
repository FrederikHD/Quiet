<!-- One file only: the button says "Choose a file", and a new file replaces the old one. -->
<script setup lang="ts">
import { QField, QFileUpload, type FileUploadItem } from '@frederikhd/quiet';
import { ref } from 'vue';

const file = ref<FileUploadItem[]>([]);
</script>

<template>
  <QField label="Price list" label-placement="top" hint="One CSV file, up to 2 MB.">
    <QFileUpload
      v-model="file"
      :multiple="false"
      accept=".csv,text/csv"
      accept-label="a CSV file"
      :max-size="2 * 1048576"
    />
  </QField>
</template>
