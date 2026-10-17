<!-- Facts people read: the term on the left and the value beside it, stacked when the list is under 480px wide. -->
<script setup lang="ts">
import { QDescriptionList } from 'quiet';
</script>

<template>
  <QDescriptionList
    :items="[
      { term: 'SKU', description: 'LC-2040' },
      { term: 'Vendor', description: 'Leinenweberei Rhön' },
      { term: 'Material', description: '100% linen, washed' },
      { term: 'Weight', description: '0,35 kg', numeric: true },
    ]"
  />
</template>
