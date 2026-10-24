<!-- connected joins the tiles of layout="buttons" into one switch, for a short either–or in a form: whether all conditions of a promotion must be true, or any of them. -->
<script setup lang="ts">
import { QRadio, QRadioGroup } from '@frederikhd/quiet';
import { ref } from 'vue';

const match = ref('AND');
</script>

<template>
  <QRadioGroup v-model="match" label="Conditions to match" layout="buttons" connected label-placement="top">
    <QRadio value="AND" label="All" />
    <QRadio value="OR" label="Any" />
  </QRadioGroup>
</template>
