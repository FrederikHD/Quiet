<!-- A "Select all" checkbox shows a dash while only some of the items below are ticked. -->
<script setup lang="ts">
import { QCheckbox, QCheckboxGroup } from '@frederikhd/quiet';
import { computed, ref } from 'vue';

const stores = ['Berlin', 'Hamburg', 'Munich'];
const selected = ref<string[]>(['Berlin']);
const all = computed(() => selected.value.length === stores.length);
const some = computed(() => selected.value.length > 0 && !all.value);
</script>

<template>
  <div>
    <QCheckbox
      label="All stores"
      :model-value="all"
      :indeterminate="some"
      @update:model-value="selected = $event ? [...stores] : []"
    />
    <QCheckboxGroup v-model="selected" class="indent" aria-label="Stores" label-placement="top">
      <QCheckbox v-for="store in stores" :key="store" :value="store" :label="store" />
    </QCheckboxGroup>
  </div>
</template>

<style scoped>
.indent {
  padding-left: calc(18px + var(--space-3));
}
</style>
