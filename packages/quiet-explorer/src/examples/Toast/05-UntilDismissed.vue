<!-- duration: 0 keeps a toast until it is dismissed; toast.dismiss(id) closes it when the work is done. -->
<script setup lang="ts">
import { QButton, toast } from 'quiet';

function importProducts() {
  const id = toast('Importing 240 products…', { duration: 0 });
  setTimeout(() => {
    toast.dismiss(id);
    toast('Imported 240 products', { tone: 'success' });
  }, 3000);
}
</script>

<template>
  <div>
    <QButton icon-start="upload" @click="importProducts">Import products</QButton>
  </div>
</template>
