<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue';
import { useRadioGroup } from '../../internal/choice';
import QChoiceRow from '../../internal/QChoiceRow.vue';
import QChoiceTile from '../../internal/QChoiceTile.vue';
import type { ImageSource } from '../../types';
import { joinIds, warnOnce } from '../../utils/dom';

export interface RadioProps {
  /** The group's value when this radio is chosen. */
  value: string;
  /** The option's name (or the `label` slot). */
  label?: string;
  /** One line under the label in ink-muted: delivery time, conditions (or the `description` slot). */
  description?: string;
  /** At the end of the row: a price, a count (or the `meta` slot). */
  meta?: string;
  /** swatches layout: the dot's colour (any CSS colour). */
  swatch?: string;
  /** swatches layout: a fabric picture for the dot instead of a colour. (decorative: the label names it). */
  image?: ImageSource;
  /** swatches / buttons layouts: crossed out but still choosable, read as "XL, sold out". */
  soldOut?: boolean;
  /** Marks this option invalid; the RadioGroup's error does this for every option. */
  invalid?: boolean;
  /** A bordered tile instead of a row; follows the group's cards layout by default. */
  card?: boolean;
  /** Can't be chosen; say why in the `description`. The group's `disabled` disables every option. */
  disabled?: boolean;
  /** Goes on the native input; the group's `id` already lands on the chosen or first option. */
  id?: string;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<RadioProps>(), {
  label: undefined,
  description: undefined,
  meta: undefined,
  swatch: undefined,
  image: undefined,
  card: undefined,
  id: undefined,
});
defineSlots<{
  /** Rich label content instead of `label`. */
  label?(): unknown;
  /** Rich description content instead of `description`. */
  description?(): unknown;
  /** Rich meta content instead of `meta`. */
  meta?(): unknown;
  /** cards layout: a small picture before the text — a payment method's icon or logo (decorative). */
  media?(): unknown;
}>();

const attrs = useAttrs();
const slots = useSlots();
const group = useRadioGroup();
const input = ref<HTMLInputElement | null>(null);

if (!group)
  warnOnce('radio-group', 'Radio: put radios inside a RadioGroup — it names the set and wires up its messages.');

const isDisabled = computed(() => props.disabled || !!group?.value.disabled);
const isInvalid = computed(() => props.invalid || !!group?.value.invalid);

const inputAttrs = computed<Record<string, unknown>>(() => {
  const { class: _c, style: _s, ...rest } = attrs;
  const g = group?.value;
  return {
    ...rest,
    type: 'radio',
    class: g?.tile ? 'q-tile__input' : 'q-choice__input',
    id: props.id ?? (g?.firstId && g.firstValue === props.value ? g.firstId : undefined),
    name: g?.name ?? rest.name,
    value: props.value,
    checked: g ? g.value === props.value : rest.checked,
    disabled: isDisabled.value,
    'aria-describedby': joinIds(rest['aria-describedby'] as string | undefined, g?.describedBy),
    onChange: (e: Event) => {
      if ((e.target as HTMLInputElement).checked) g?.select(props.value);
      (rest.onChange as ((e: Event) => void) | undefined)?.(e);
    },
  };
});

defineExpose({ input, focus: () => input.value?.focus() });
</script>

<template>
  <QChoiceTile
    v-if="group?.tile"
    :class="attrs.class"
    :style="attrs.style as any"
    :variant="group.tile"
    :label="label"
    :description="description"
    :swatch="swatch"
    :image="image?.src"
    :sold-out="soldOut"
    :disabled="isDisabled"
    :invalid="isInvalid"
  >
    <template #input><input ref="input" v-bind="inputAttrs" /></template>
  </QChoiceTile>
  <QChoiceRow
    v-else
    :class="attrs.class"
    :style="attrs.style as any"
    kind="radio"
    :card="card ?? !!group?.card"
    :disabled="isDisabled"
    :invalid="isInvalid"
    :label="label"
    :description="description"
    :meta="meta"
    :has-media="!!slots.media"
    :has-description="!!description || !!slots.description"
    :has-meta="meta != null || !!slots.meta"
  >
    <template #input><input ref="input" v-bind="inputAttrs" /></template>
    <template v-if="slots.media" #media><slot name="media" /></template>
    <template v-if="slots.label" #label><slot name="label" /></template>
    <template v-if="slots.description" #description><slot name="description" /></template>
    <template v-if="slots.meta" #meta><slot name="meta" /></template>
  </QChoiceRow>
</template>
