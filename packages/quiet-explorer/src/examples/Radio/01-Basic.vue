<!-- A Radio is one option inside a RadioGroup: the circle and its label; the whole row is the click target. -->
<script setup lang="ts">
import { QRadio, QRadioGroup } from '@frederikhd/quiet';
import { ref } from 'vue';

const sort = ref('newest');
</script>

<template>
  <QRadioGroup v-model="sort" label="Sort products by" label-placement="top">
    <QRadio value="newest" label="Newest first" />
    <QRadio value="price-asc" label="Price, low to high" />
    <QRadio value="price-desc" label="Price, high to low" />
  </QRadioGroup>
</template>
