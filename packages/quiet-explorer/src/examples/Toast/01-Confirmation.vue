<!-- toast() confirms what just happened, in a few words. AppShell includes a Toaster; other apps place <QToaster /> once. -->
<script setup lang="ts">
import { QButton, toast } from 'quiet';
</script>

<template>
  <div>
    <QButton variant="primary" @click="toast('Product saved')">Save product</QButton>
  </div>
</template>
