<!-- An empty value shows "—" (or empty-text), never a blank gap. -->
<script setup lang="ts">
import { QDescriptionList } from '@frederikhd/quiet';
</script>

<template>
  <QDescriptionList
    empty-text="Not set"
    :items="[
      { term: 'SKU', description: 'LC-2040' },
      { term: 'Barcode', description: '' },
      { term: 'Country of origin', description: null },
    ]"
  />
</template>
