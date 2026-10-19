<script setup lang="ts">
import { computed, nextTick, onUpdated, ref, useAttrs, useSlots, watch } from 'vue';
import { useFormReset } from '../../composables/useFormReset';
import { joinIds, warnOnce } from '../../utils/dom';
import { useControlId, useFieldControl } from '../Field/context';
import QIcon from '../Icon/QIcon.vue';
import type { IconName } from '../Icon/icons';

export type SelectOption = string | { value: string; label?: string; disabled?: boolean };
export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
  disabled?: boolean;
}

export interface SelectProps {
  /** The choices: strings, { value, label, disabled }, or groups { label, options }. Or put <option>/<optgroup> in the default slot. */
  options?: (SelectOption | SelectOptionGroup)[];
  /** Shown while nothing is chosen, in ink-muted ("Choose a country"). On a required select it can't be picked again; on an optional one it stays as the "none" choice. */
  placeholder?: string;
  /** Same sizes as Input: default follows data-density (40/32px), slim 28px (back office, desktop), large 48px (storefront). */
  size?: 'slim' | 'default' | 'large';
  /** Error border and aria-invalid; the message comes from Field. */
  invalid?: boolean;
  /** An icon before the value, e.g. "sliders" for "Sort by". */
  prefixIcon?: IconName;
  /** Shown like a read-only Input and kept in form posts; can't be changed (or focused — a native select has no read-only mode). */
  readonly?: boolean;
  /** Greyed out and skipped by Tab. */
  disabled?: boolean;
  /** Required: the placeholder can't be picked again once something is chosen. Sets aria-required. */
  required?: boolean;
  /** Inside a Field the Field's id wins. */
  id?: string;
  /** Posted with the form (also while read-only, through a hidden input). */
  name?: string;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SelectProps>(), {
  size: 'default',
  options: undefined,
  placeholder: undefined,
  prefixIcon: undefined,
  id: undefined,
  name: undefined,
});
const model = defineModel<string | null>();
defineSlots<{
  /** <option> and <optgroup> elements, instead of `options`. */
  default?(): unknown;
  /** Your own content before the value. */
  prefix?(): unknown;
}>();

const attrs = useAttrs();
const slots = useSlots();
const field = useFieldControl();
const select = ref<HTMLSelectElement | null>(null);

// The DOM follows the value. With no value and no placeholder the select shows its first option, like a native one.
function sync() {
  const el = select.value;
  const v = model.value ?? (props.placeholder != null ? '' : null);
  if (el && v != null && el.value !== v) el.value = v;
}
watch([model, select], sync, { flush: 'post' });
onUpdated(sync); // options rendered later (or changed) still show the value
function onChange(e: Event) {
  model.value = (e.target as HTMLSelectElement).value;
}

// The value the select starts with, so a form reset can bring it (and the placeholder styling) back.
const initial = model.value ?? (props.placeholder != null ? '' : null);
useFormReset(select, () => {
  model.value = initial;
  nextTick(sync);
});

const controlId = useControlId(field, () => props.id);
// A native select has no read-only state: shown like a read-only Input, it can't be changed, and a hidden input
// carries its value in form posts (a disabled select would drop it).
const isReadonly = computed(() => (props.readonly || !!field?.value.readOnly) && !props.disabled);
const isDisabled = computed(() => props.disabled || !!field?.value.disabled || isReadonly.value);
const isInvalid = computed(
  () => props.invalid || !!field?.value.invalid || attrs['aria-invalid'] === true || attrs['aria-invalid'] === 'true',
);
const isRequired = computed(() => props.required || !!field?.value.required || attrs['aria-required'] === 'true');
const isEmpty = computed(() => props.placeholder != null && (model.value == null || model.value === ''));
const hasPrefix = computed(() => !!props.prefixIcon || !!slots.prefix);

if (import.meta.env.DEV && !controlId.value && !attrs['aria-label'] && !attrs['aria-labelledby']) {
  warnOnce('select-label', 'Select: give it a visible label — wrap it in Field, or pass id, aria-label or aria-labelledby.');
}

const selectAttrs = computed<Record<string, unknown>>(() => {
  const { class: _c, style: _s, ...rest } = attrs;
  return {
    ...rest,
    id: controlId.value,
    name: isReadonly.value ? undefined : props.name,
    disabled: isDisabled.value,
    required: props.required || undefined,
    'aria-required': field?.value.required ? 'true' : rest['aria-required'],
    'aria-describedby': joinIds(rest['aria-describedby'] as string | undefined, field?.value.describedBy),
    'aria-invalid': isInvalid.value ? 'true' : undefined,
  };
});

function isGroup(o: SelectOption | SelectOptionGroup): o is SelectOptionGroup {
  return typeof o === 'object' && 'options' in o;
}
function optValue(o: SelectOption) {
  return typeof o === 'object' ? o.value : o;
}
function optLabel(o: SelectOption) {
  return typeof o === 'object' ? (o.label ?? o.value) : o;
}
function optDisabled(o: SelectOption) {
  return typeof o === 'object' ? !!o.disabled : false;
}

defineExpose({ select, focus: () => select.value?.focus() });
</script>

<template>
  <span
    :class="[
      'q-input',
      'q-select',
      size === 'slim' && 'q-input--slim',
      size === 'large' && 'q-input--large',
      isInvalid && 'q-input--invalid',
      isReadonly ? 'q-input--readonly' : isDisabled && 'q-input--disabled',
      hasPrefix && 'q-select--prefixed',
      isEmpty && 'q-select--empty',
      attrs.class,
    ]"
    :style="attrs.style as any"
  >
    <span v-if="hasPrefix" class="q-input__affix q-input__affix--start q-select__prefix" aria-hidden="true">
      <slot name="prefix"><QIcon v-if="prefixIcon" :name="prefixIcon" /></slot>
    </span>
    <select ref="select" v-bind="selectAttrs" class="q-select__field" @change="onChange">
      <!-- Required: the placeholder can't be picked again once something is chosen. Optional: it stays as the "none" choice. -->
      <option v-if="placeholder != null" value="" :disabled="isRequired" :hidden="isRequired">{{ placeholder }}</option>
      <template v-if="options">
        <template v-for="(o, i) in options" :key="isGroup(o) ? `g${i}` : optValue(o)">
          <optgroup v-if="isGroup(o)" :label="o.label" :disabled="o.disabled">
            <option v-for="c in o.options" :key="optValue(c)" :value="optValue(c)" :disabled="optDisabled(c)">{{ optLabel(c) }}</option>
          </optgroup>
          <option v-else :value="optValue(o)" :disabled="optDisabled(o)">{{ optLabel(o) }}</option>
        </template>
      </template>
      <slot v-else />
    </select>
    <span class="q-select__chevron" aria-hidden="true"><QIcon name="chevron-down" /></span>
    <input v-if="isReadonly && name" type="hidden" :name="name" :value="model ?? ''" />
  </span>
</template>
