<!-- placement="end" turns the dialog into a full-height drawer from the side, for filters beside a product list. -->
<script setup lang="ts">
import { QButton, QCheckbox, QCheckboxGroup, QDialog, QRadio, QRadioGroup } from '@frederikhd/quiet';
import { ref } from 'vue';

const open = ref(false);
const sizes = ref<string[]>(['M']);
const sort = ref('newest');

function clear() {
  sizes.value = [];
  sort.value = 'newest';
}
</script>

<template>
  <div>
    <QButton icon-start="filter" @click="open = true">Filters</QButton>
    <QDialog v-model:open="open" placement="end" title="Filters" close-text="Done">
      <div class="groups">
        <QCheckboxGroup v-model="sizes" label="Size">
          <QCheckbox v-for="s in ['S', 'M', 'L', 'XL']" :key="s" :value="s" :label="s" />
        </QCheckboxGroup>
        <QRadioGroup v-model="sort" label="Sort by">
          <QRadio value="newest" label="Newest" />
          <QRadio value="price-asc" label="Price, low to high" />
          <QRadio value="price-desc" label="Price, high to low" />
        </QRadioGroup>
      </div>
      <template #footer>
        <QButton @click="clear">Clear all</QButton>
        <QButton variant="primary" @click="open = false">Show 24 products</QButton>
      </template>
    </QDialog>
  </div>
</template>

<style scoped>
.groups { display: grid; gap: var(--space-6); }
</style>
