<!-- Unchecked, checked, indeterminate, invalid, and disabled with and without a tick. -->
<script setup lang="ts">
import { QCheckbox } from '@frederikhd/quiet';
import { reactive } from 'vue';

const ticks = reactive({ unchecked: false, checked: true, some: false, invalid: false });
</script>

<template>
  <div class="list">
    <QCheckbox v-model="ticks.unchecked" label="Unchecked" />
    <QCheckbox v-model="ticks.checked" label="Checked" />
    <QCheckbox v-model="ticks.some" label="Indeterminate" :indeterminate="!ticks.some" />
    <QCheckbox v-model="ticks.invalid" label="Invalid" :invalid="!ticks.invalid" />
    <QCheckbox label="Disabled" disabled />
    <QCheckbox label="Disabled, checked" disabled :model-value="true" />
  </div>
</template>

<style scoped>
.list { display: grid; }
</style>
