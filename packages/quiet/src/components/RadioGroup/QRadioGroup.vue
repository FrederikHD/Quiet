<script setup lang="ts">
import { computed, ref, useAttrs, useModel } from 'vue';
import { useFormReset } from '../../composables/useFormReset';
import { RADIO_GROUP_KEY } from '../../internal/choice';
import QChoiceGroupFrame from '../../internal/QChoiceGroupFrame.vue';
import { useChoiceGroup, type ChoiceGroupProps } from '../../internal/useChoiceGroup';
import { warnOnce } from '../../utils/dom';

export interface RadioGroupProps extends ChoiceGroupProps {
  /** Starting value when you don't use v-model; a form reset goes back to it (or to null without one). */
  defaultValue?: string | null;
  /** Needed when there is no visible label. */
  ariaLabel?: string;
  /** The chosen radio's value; null for none yet. */
  modelValue?: string | null;
  /** buttons only: the tiles join into one row with a shared border, like a segmented switch (All | Any). */
  connected?: boolean;
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
  modelValue: undefined,
});
defineEmits<{ 'update:modelValue': [value: string | null] }>();
const model = useModel(props, 'modelValue');
defineSlots<{
  /** Radios, each with a `value` and a `label`. */
  default(): unknown;
  /** Rich hint content instead of `hint`. */
  hint?(): unknown;
}>();

if (props.label == null && !props.ariaLabel && !useAttrs()['aria-labelledby'])
  warnOnce('radiogroup-label', 'RadioGroup: pass a label — it is the question the radios answer.');

if (props.connected && props.layout !== 'buttons')
  warnOnce(
    'radiogroup-connected',
    'RadioGroup: connected joins the tiles of layout="buttons" and does nothing in other layouts.',
  );

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
// Joined tiles name their option themselves; the chosen name beside the question would only repeat it.
const joined = computed(() => props.connected && layout.value === 'buttons');
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
    :chosen="joined ? null : chosen()"
    :connected="joined"
    :label-id="labelId"
    :hint-id="hintId"
    :msg-id="msgId"
  >
    <slot />
    <template v-if="slots.hint" #hint><slot name="hint" /></template>
  </QChoiceGroupFrame>
</template>
