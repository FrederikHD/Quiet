<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue';
import { useCheckGroup } from '../../internal/choice';
import QChoiceRow from '../../internal/QChoiceRow.vue';
import QChoiceTile from '../../internal/QChoiceTile.vue';
import { joinIds, warnOnce } from '../../utils/dom';

export interface CheckboxProps {
  /** The option's name. Clicking it toggles the box. (Or the `label` slot.) */
  label?: string;
  /** One line under the label in ink-muted: what it does, delivery time. */
  description?: string;
  /** Right-aligned and tabular: a price, a count. */
  meta?: string;
  /** Inside a CheckboxGroup: identifies the option in the group's value array. */
  value?: string;
  /** swatches layout (filters): the dot's colour. */
  swatch?: string;
  /** swatches layout: a fabric picture instead of a colour. */
  image?: string;
  /** swatches / buttons layouts: crossed out. */
  soldOut?: boolean;
  /** Keeps the label for screen readers only — table rows ("Select order #10421"). */
  labelHidden?: boolean;
  /** Shows a dash: some, not all, of the items below are ticked ("Select all"). */
  indeterminate?: boolean;
  invalid?: boolean;
  /** Bordered tile. Inside a CheckboxGroup with layout="cards" this is set for you. */
  card?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CheckboxProps>(), {
  label: undefined,
  description: undefined,
  meta: undefined,
  value: undefined,
  swatch: undefined,
  image: undefined,
  card: undefined,
  name: undefined,
  id: undefined,
});
/** Ticked or not (on its own; inside a CheckboxGroup the group holds the value). */
const checked = defineModel<boolean>({ default: false });
defineSlots<{ label?(): unknown; description?(): unknown; meta?(): unknown }>();

const attrs = useAttrs();
const slots = useSlots();
const group = useCheckGroup();
const input = ref<HTMLInputElement | null>(null);

if (import.meta.env.DEV && props.label == null && !slots.label && !attrs['aria-label']) {
  warnOnce('check-label', 'Checkbox: pass a label (use labelHidden to hide it visually, e.g. in table rows).');
}

const isDisabled = computed(() => props.disabled || !!group?.value.disabled);
const isInvalid = computed(() => props.invalid || !!group?.value.invalid);
const managed = computed(() => Array.isArray(group?.value.value));
const isChecked = computed(() =>
  managed.value ? (group!.value.value as string[]).includes(props.value ?? '') : checked.value,
);

function onChange(e: Event) {
  const on = (e.target as HTMLInputElement).checked;
  if (managed.value) group!.value.toggle(props.value ?? '', on);
  checked.value = on;
}

const inputAttrs = computed<Record<string, unknown>>(() => {
  const { class: _c, style: _s, ...rest } = attrs;
  const g = group?.value;
  return {
    ...rest,
    type: 'checkbox',
    class: g?.tile ? 'q-tile__input' : 'q-choice__input',
    id: props.id ?? (g?.firstId && g.firstValue === props.value ? g.firstId : undefined),
    name: props.name ?? g?.name,
    value: props.value,
    checked: isChecked.value,
    indeterminate: props.indeterminate,
    disabled: isDisabled.value,
    'aria-invalid': isInvalid.value ? 'true' : undefined,
    'aria-required': rest['aria-required'] ?? (g?.requiredSingle ? 'true' : undefined),
    'aria-describedby': joinIds(rest['aria-describedby'] as string | undefined, g?.describedBy),
    onChange,
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
    :image="image"
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
    kind="checkbox"
    :card="card ?? !!group?.card"
    :disabled="isDisabled"
    :invalid="isInvalid"
    :label-hidden="labelHidden"
    :label="label"
    :description="description"
    :meta="meta"
    :has-description="!!description || !!slots.description"
    :has-meta="meta != null || !!slots.meta"
  >
    <template #input><input ref="input" v-bind="inputAttrs" /></template>
    <template v-if="slots.label" #label><slot name="label" /></template>
    <template v-if="slots.description" #description><slot name="description" /></template>
    <template v-if="slots.meta" #meta><slot name="meta" /></template>
  </QChoiceRow>
</template>
