<!-- The collection's filters: beside the grid on wide screens, in the Filter sheet on phones. -->
<script setup lang="ts">
import { QCheckbox, QCheckboxGroup, QDisclosure, QPriceRange, money } from '@frederikhd/quiet';
import { computed, ref, watch } from 'vue';
import { swatchOf } from '../fixtures/pictures';

export interface Filters {
  colours: string[];
  sizes: string[];
  price: [number, number];
  inStock: boolean;
}
const props = defineProps<{
  /** How many products each option would show, so options with none are disabled. */
  counts: { colours: Record<string, number>; sizes: Record<string, number> };
  priceBounds: [number, number];
}>();
const filters = defineModel<Filters>({ required: true });

const colours = ['Navy', 'Sand', 'Olive', 'Rust', 'Natural', 'Sage'];
const sizes = ['XS', 'S', 'M', 'L', 'XL'];
const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
  (filters.value = { ...filters.value, [key]: value });
// The range follows the thumbs as they move; the products filter when it's let go (@commit).
const price = ref<[number, number]>([...filters.value.price]);
watch(
  () => filters.value.price,
  (p) => (price.value = [...p]),
);
const priceMeta = computed(() =>
  filters.value.price[0] === props.priceBounds[0] && filters.value.price[1] === props.priceBounds[1]
    ? ''
    : `${money(filters.value.price[0])} – ${money(filters.value.price[1])}`,
);
</script>

<template>
  <div class="filters">
    <QDisclosure title="Colour" :meta="filters.colours.join(', ')" default-open>
      <QCheckboxGroup
        :model-value="filters.colours"
        label="Colour"
        label-hidden
        layout="swatches"
        @update:model-value="set('colours', $event ?? [])"
      >
        <QCheckbox
          v-for="c in colours"
          :key="c"
          :value="c"
          :label="c"
          :swatch="swatchOf(c)"
          :description="`${counts.colours[c] ?? 0} products`"
          :disabled="!counts.colours[c] && !filters.colours.includes(c)"
        />
      </QCheckboxGroup>
    </QDisclosure>
    <QDisclosure title="Size" :meta="filters.sizes.join(', ')" default-open>
      <QCheckboxGroup
        :model-value="filters.sizes"
        label="Size"
        label-hidden
        layout="buttons"
        @update:model-value="set('sizes', $event ?? [])"
      >
        <QCheckbox
          v-for="s in sizes"
          :key="s"
          :value="s"
          :label="s"
          :disabled="!counts.sizes[s] && !filters.sizes.includes(s)"
        />
      </QCheckboxGroup>
    </QDisclosure>
    <QDisclosure title="Price" :meta="priceMeta" default-open>
      <QPriceRange
        v-model="price"
        :min="priceBounds[0]"
        :max="priceBounds[1]"
        :step="10"
        label-hidden
        @commit="set('price', $event)"
      />
    </QDisclosure>
    <QDisclosure title="Availability" :meta="filters.inStock ? 'In stock' : ''" default-open>
      <QCheckbox :model-value="filters.inStock" label="In stock only" @update:model-value="set('inStock', !!$event)" />
    </QDisclosure>
  </div>
</template>
