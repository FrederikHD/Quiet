<!-- Disabled through the Field, with the reason in the hint. -->
<script setup lang="ts">
import { QField, QFileUpload } from 'quiet';
</script>

<template>
  <QField label="Size chart" label-placement="top" disabled hint="Available once the product is saved.">
    <QFileUpload />
  </QField>
</template>
