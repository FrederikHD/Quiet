<!-- An error blocks saving: it turns the control red and says how to fix the value. -->
<script setup lang="ts">
import { QField, QInput } from 'quiet';
import { ref } from 'vue';

const email = ref('anna@example');
</script>

<template>
  <QField label="Email" required label-placement="top" width="l" error="Enter an email address in the format name@example.com">
    <QInput v-model="email" type="email" autocomplete="email" />
  </QField>
</template>
