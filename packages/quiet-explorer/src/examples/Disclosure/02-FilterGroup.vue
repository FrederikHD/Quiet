<!-- A filter group in the shop: meta says what's chosen, so the group still tells it when closed. -->
<script setup lang="ts">
import { QCheckbox, QCheckboxGroup, QDisclosure } from '@frederikhd/quiet';
import { ref } from 'vue';

const sizes = ref<string[]>(['M']);
</script>

<template>
  <div class="filters">
    <QDisclosure title="Size" :meta="sizes.join(', ')" default-open>
      <QCheckboxGroup v-model="sizes" label="Size" label-hidden layout="buttons">
        <QCheckbox v-for="z in ['XS', 'S', 'M', 'L', 'XL']" :key="z" :value="z" :label="z" :disabled="z === 'XS'" />
      </QCheckboxGroup>
    </QDisclosure>
  </div>
</template>

<style scoped>
.filters { max-width: 320px; }
</style>
