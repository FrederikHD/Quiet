<script setup lang="ts">
// swatches / buttons layouts: a colour dot or a size tile instead of a row. The native input stays (arrow keys,
// forms, reset); the face beside it is what people see. Sold out stays choosable (so "Notify me" can follow).
import { computed } from 'vue';
import { useStrings } from '../config';

const props = defineProps<{
  variant: 'swatches' | 'buttons';
  label?: string;
  description?: string;
  swatch?: string;
  image?: string;
  soldOut?: boolean;
  disabled?: boolean;
  invalid?: boolean;
}>();

const strings = useStrings('choice', { soldOut: 'sold out' });
const isSwatch = computed(() => props.variant === 'swatches');
const title = computed(() =>
  props.label ? props.label + (props.soldOut ? ` (${strings.value.soldOut})` : '') : undefined,
);
const faceStyle = computed(() => ({
  '--q-swatch': props.swatch || 'transparent',
  backgroundImage: props.image ? `url("${String(props.image).replace(/"/g, '%22')}")` : undefined,
}));
</script>

<template>
  <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -- the label wraps the input, which is passed in as a vnode the linter cannot see -->
  <label
    :class="[
      'q-tile',
      isSwatch ? 'q-tile--swatch' : 'q-tile--button',
      soldOut && 'is-soldout',
      disabled && 'is-disabled',
      invalid && 'is-invalid',
    ]"
    :title="isSwatch ? title : undefined"
  >
    <slot name="input" />
    <span v-if="isSwatch" class="q-tile__face" aria-hidden="true" :style="faceStyle" />
    <span v-else class="q-tile__face" aria-hidden="true">{{ label }}</span>
    <span class="q-visually-hidden">
      {{ label }}<template v-if="soldOut">, {{ strings.soldOut }}</template
      ><span v-if="description">, {{ description }}</span>
    </span>
  </label>
</template>
