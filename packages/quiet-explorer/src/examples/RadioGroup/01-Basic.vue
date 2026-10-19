<!-- Exactly one answer out of a few, all visible; preselect the most common one. -->
<script setup lang="ts">
import { QRadio, QRadioGroup } from '@frederikhd/quiet';
import { ref } from 'vue';

const status = ref('active');
</script>

<template>
  <QRadioGroup v-model="status" label="Product status">
    <QRadio value="active" label="Active" description="Visible in the shop" />
    <QRadio value="draft" label="Draft" description="Only you can see it" />
    <QRadio value="archived" label="Archived" description="Has open orders" disabled />
  </QRadioGroup>
</template>
