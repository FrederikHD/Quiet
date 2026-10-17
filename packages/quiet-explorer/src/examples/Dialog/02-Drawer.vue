<script setup lang="ts">
import { QButton, QCheckbox, QCheckboxGroup, QDialog, QRadio, QRadioGroup } from 'quiet';
import { ref } from 'vue';

// placement="end": a full-height drawer from the side on every screen, for filters beside a list.
const open = ref(false);
const sizes = ref<string[]>(['M']);
const sort = ref('newest');

function clear() {
  sizes.value = [];
  sort.value = 'newest';
}
</script>

<template>
  <div class="pv">
    <p class="pv-title">placement="end" — filters in a drawer</p>
    <div>
      <QButton icon-start="filter" @click="open = true">Filters</QButton>
    </div>

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
        <QButton variant="primary" @click="open = false">Show results</QButton>
      </template>
    </QDialog>
  </div>
</template>

<style scoped>
.pv { display: grid; gap: var(--space-3); }
.pv-title { margin: 0; font: var(--text-caption); color: var(--ink-muted); }
.groups { display: grid; gap: var(--space-6); }
</style>
