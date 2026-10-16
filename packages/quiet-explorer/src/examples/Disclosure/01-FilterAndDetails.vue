<script setup lang="ts">
import { QCheckbox, QCheckboxGroup, QDisclosure } from 'quiet';
import { ref } from 'vue';

const sizes = ref<string[]>(['M']);
</script>

<template>
  <div class="pv">
    <QDisclosure title="Size" default-open :meta="sizes.join(', ')">
      <QCheckboxGroup v-model="sizes" label="Size" label-hidden layout="buttons">
        <QCheckbox v-for="z in ['XS', 'S', 'M', 'L', 'XL']" :key="z" :value="z" :label="z" :disabled="z === 'XS'" />
      </QCheckboxGroup>
    </QDisclosure>
    <QDisclosure title="Material and care"><p>100% linen from the Rhön. Machine washable at 30 °C, hang to dry.</p></QDisclosure>
    <QDisclosure title="Shipping and returns"><p>Ships in 1–2 working days. Free from 75 €; 30 days to return.</p></QDisclosure>
  </div>
</template>

<style scoped>
.pv { max-width: 420px; }
p { margin: 0; }
</style>
