<script setup lang="ts">
import { computed, ref, useModel } from 'vue';
import { useFormReset } from '../../composables/useFormReset';
import { CHECK_GROUP_KEY } from '../../internal/choice';
import QChoiceGroupFrame from '../../internal/QChoiceGroupFrame.vue';
import { useChoiceGroup, type ChoiceGroupProps } from '../../internal/useChoiceGroup';

export interface CheckboxGroupProps extends ChoiceGroupProps {
  /** Starting value when you don't use v-model; a form reset goes back to it. Leave both out to let each Checkbox manage itself. */
  defaultValue?: string[];
  /** Needed when there is no visible label. */
  ariaLabel?: string;
  /** The ticked options' values. */
  modelValue?: string[];
}

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
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
  modelValue: undefined,
});
defineEmits<{ 'update:modelValue': [value: string[]] }>();
const model = useModel(props, 'modelValue');
defineSlots<{
  /** Checkboxes, each with a `value` and a `label`. */
  default(): unknown;
  /** Rich hint content instead of `hint`. */
  hint?(): unknown;
}>();

if (model.value === undefined && props.defaultValue !== undefined) model.value = [...props.defaultValue];

// A form reset puts the group back to its defaultValue.
const root = ref<{ $el: HTMLElement } | null>(null);
useFormReset(
  computed(() => root.value?.$el ?? null),
  () => {
    if (props.defaultValue !== undefined) model.value = [...props.defaultValue];
  },
);

const g = useChoiceGroup(
  'checkbox',
  props,
  CHECK_GROUP_KEY,
  () => model.value ?? null,
  (next) => (model.value = next as string[]),
);
const {
  placement,
  markers,
  strings: fstrings,
  status,
  summaryShown,
  layout,
  labelId,
  hintId,
  msgId,
  chosen,
  slots,
} = g;
</script>

<template>
  <QChoiceGroupFrame
    ref="root"
    kind="checkbox"
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
