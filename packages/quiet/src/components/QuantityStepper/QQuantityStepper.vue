<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import { useStrings } from '../../config';
import { useFormReset } from '../../composables/useFormReset';
import { joinIds, warnOnce } from '../../utils/dom';
import { useFieldControl } from '../Field/context';
import QIcon from '../Icon/QIcon.vue';

export interface QuantityStepperProps {
  /** Default 1; 0 for cart lines (removing the line is up to you). */
  min?: number;
  /** Default 99. */
  max?: number;
  step?: number;
  /** large: 48px, for the product page. Phones are always 48px. */
  size?: 'default' | 'large';
  invalid?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  id?: string;
  strings?: { decrease?: string; increase?: string };
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<QuantityStepperProps>(), {
  min: 1,
  max: 99,
  step: 1,
  size: 'default',
  id: undefined,
  strings: undefined,
});
/** The number; only updated when it changes. */
const model = defineModel<number>();

const attrs = useAttrs();
const field = useFieldControl();
const strings = useStrings('stepper', { decrease: 'Decrease quantity', increase: 'Increase quantity' }, () => props.strings);
const root = ref<HTMLElement | null>(null);
const input = ref<HTMLInputElement | null>(null);
// Typing is kept as a draft and committed (clamped to min–max, snapped to step) on blur or Enter.
const draft = ref<string | null>(null);
const initial = model.value ?? props.min;
const value = computed(() => model.value ?? initial);

useFormReset(root, () => {
  model.value = initial;
  draft.value = null;
});

const controlId = computed(() => props.id ?? field?.value.id);
const isDisabled = computed(() => props.disabled || !!field?.value.disabled);
const isReadonly = computed(() => props.readonly || !!field?.value.readOnly);
const isInvalid = computed(() => props.invalid || !!field?.value.invalid || attrs['aria-invalid'] === 'true');
const canDown = computed(() => !isDisabled.value && !isReadonly.value && value.value > props.min);
const canUp = computed(() => !isDisabled.value && !isReadonly.value && value.value < props.max);

if (import.meta.env.DEV && !controlId.value && !attrs['aria-label'] && !attrs['aria-labelledby']) {
  warnOnce('stepper-label', 'QuantityStepper: wrap it in a Field, or pass aria-label ("Quantity of Linen shirt").');
}

function clamp(n: number) {
  if (Number.isNaN(n)) return value.value;
  const snapped = Math.round((n - props.min) / props.step) * props.step + props.min;
  return Math.min(props.max, Math.max(props.min, snapped));
}
function commit(n: number) {
  const next = clamp(n);
  draft.value = null;
  if (next !== value.value) model.value = next;
}
function bump(d: number) {
  if (!isDisabled.value && !isReadonly.value) commit(value.value + d);
}
// The keyboard uses ↑ ↓ (PageUp/PageDown ×10, Home/End) on the field, so the whole control is one Tab stop.
function onKeyDown(e: KeyboardEvent) {
  if (e.defaultPrevented || isReadonly.value || isDisabled.value) return;
  const base = draft.value ? parseInt(draft.value, 10) : value.value;
  const { step, min, max } = props;
  const to =
    e.key === 'ArrowUp' ? base + step
    : e.key === 'ArrowDown' ? base - step
    : e.key === 'PageUp' ? base + step * 10
    : e.key === 'PageDown' ? base - step * 10
    : e.key === 'Home' ? min
    : e.key === 'End' ? max
    : null;
  if (to != null) {
    e.preventDefault();
    commit(to);
  } else if (e.key === 'Enter' && draft.value != null) {
    e.preventDefault();
    commit(draft.value === '' ? value.value : parseInt(draft.value, 10));
  }
}
// Digits only; the field shows the filtered text straight away.
function onInput(e: Event) {
  const t = e.target as HTMLInputElement;
  t.value = t.value.replace(/[^0-9]/g, '');
  draft.value = t.value;
}
function onBlur() {
  if (draft.value != null) commit(draft.value === '' ? value.value : parseInt(draft.value, 10));
}

const inputAttrs = computed<Record<string, unknown>>(() => {
  const { class: _c, style: _s, ...rest } = attrs;
  return {
    type: 'text',
    inputmode: 'numeric',
    autocomplete: 'off',
    ...rest,
    id: controlId.value,
    role: 'spinbutton',
    'aria-valuenow': value.value,
    'aria-valuemin': props.min,
    'aria-valuemax': props.max,
    'aria-invalid': isInvalid.value ? 'true' : undefined,
    'aria-required': field?.value.required ? 'true' : rest['aria-required'],
    'aria-describedby': joinIds(rest['aria-describedby'] as string | undefined, field?.value.describedBy),
    disabled: isDisabled.value,
    readonly: isReadonly.value,
  };
});

defineExpose({ input, focus: () => input.value?.focus() });
</script>

<template>
  <span
    ref="root"
    :class="[
      'q-input',
      'q-stepper',
      size === 'large' && 'q-input--large',
      isInvalid && 'q-input--invalid',
      isDisabled && 'q-input--disabled',
      isReadonly && 'q-input--readonly',
      attrs.class,
    ]"
    :style="attrs.style as any"
  >
    <!-- − and + are for pointer and touch; the keyboard uses the arrow keys on the field. -->
    <button type="button" class="q-stepper__btn" tabindex="-1" :aria-label="strings.decrease" :disabled="!canDown" @click="bump(-step)">
      <QIcon name="minus" />
    </button>
    <input
      ref="input"
      v-bind="inputAttrs"
      class="q-input__field q-stepper__field"
      :value="draft ?? String(value)"
      @input="onInput"
      @blur="onBlur"
      @keydown="onKeyDown"
    />
    <button type="button" class="q-stepper__btn" tabindex="-1" :aria-label="strings.increase" :disabled="!canUp" @click="bump(step)">
      <QIcon name="plus" />
    </button>
  </span>
</template>
