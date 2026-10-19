<!-- The row that ends a form: Cancel, then the primary Save last, on the right. -->
<script setup lang="ts">
import { QButton, QFormActions } from '@frederikhd/quiet';
</script>

<template>
  <QFormActions>
    <QButton>Cancel</QButton>
    <QButton variant="primary" type="submit">Save product</QButton>
  </QFormActions>
</template>
