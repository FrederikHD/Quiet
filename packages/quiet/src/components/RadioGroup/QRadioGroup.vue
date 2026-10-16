<script setup lang="ts">
import { computed, ref } from 'vue';
import { useFormReset } from '../../composables/useFormReset';
import { RADIO_GROUP_KEY } from '../../internal/choice';
import QChoiceGroupFrame from '../../internal/QChoiceGroupFrame.vue';
import { useChoiceGroup, type ChoiceGroupProps } from '../../internal/useChoiceGroup';

export interface RadioGroupProps extends ChoiceGroupProps {
  /** Starting value when you don't use v-model. */
  defaultValue?: string | null;
  /** Needed when there is no visible label. */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<RadioGroupProps>(), {
  label: undefined,
  help: undefined,
  hint: undefined,
  error: undefined,
  warning: undefined,
  success: undefined,
  labelPlacement: undefined,
  labelWidth: undefined,
  markers: undefined,
  strings: undefined,
  layout: 'list',
  columns: undefined,
  name: undefined,
  id: undefined,
  defaultValue: undefined,
  ariaLabel: undefined,
});
/** The chosen radio's value; null for none yet. */
const model = defineModel<string | null>();
defineSlots<{
  /** Radios, each with a `value` and a `label`. */
  default(): unknown;
  hint?(): unknown;
}>();

if (model.value === undefined && props.defaultValue !== undefined) model.value = props.defaultValue;

// A form reset puts the group back to its defaultValue.
const root = ref<{ $el: HTMLElement } | null>(null);
useFormReset(
  computed(() => root.value?.$el ?? null),
  () => {
    model.value = props.defaultValue ?? null;
  },
);

const g = useChoiceGroup(
  'radio',
  props,
  RADIO_GROUP_KEY,
  () => model.value ?? null,
  (next) => (model.value = next as string),
);
const { placement, markers, strings: fstrings, status, summaryShown, layout, labelId, hintId, msgId, chosen, slots } = g;
</script>

<template>
  <QChoiceGroupFrame
    ref="root"
    kind="radio"
    :layout="layout"
    :placement="placement"
    :label="label"
    :label-hidden="labelHidden"
    :label-width="labelWidth"
    :aria-label="ariaLabel"
    :help="help"
    :hint="hint"
    :has-hint="!!hint || !!slots.hint"
    :required="required"
    :disabled="disabled"
    :columns="columns"
    :markers="markers"
    :strings="fstrings"
    :status="status"
    :summary-shown="summaryShown"
    :chosen="chosen()"
    :label-id="labelId"
    :hint-id="hintId"
    :msg-id="msgId"
  >
    <slot />
    <template v-if="slots.hint" #hint><slot name="hint" /></template>
  </QChoiceGroupFrame>
</template>
