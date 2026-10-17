<!-- One option can't be chosen: disable it and say why in its description. -->
<script setup lang="ts">
import { QRadio, QRadioGroup } from 'quiet';
import { ref } from 'vue';

const status = ref('active');
</script>

<template>
  <QRadioGroup v-model="status" label="Product status" label-placement="top">
    <QRadio value="active" label="Active" description="Visible in the shop" />
    <QRadio value="draft" label="Draft" description="Only you can see it" />
    <QRadio value="archived" label="Archived" description="Not possible while it has open orders" disabled />
  </QRadioGroup>
</template>
