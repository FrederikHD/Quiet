<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue';
import { useStrings } from '../../config';
import { joinIds, warnOnce } from '../../utils/dom';
import { useControlId, useFieldControl } from '../Field/context';

export interface InputProps {
  /** default follows the nearest data-density (40px comfortable, 32px compact). slim is a fixed 28px for filter bars and table cells (back office, desktop). large is a fixed 48px for storefront search, newsletter and checkout fields. */
  size?: 'slim' | 'default' | 'large';
  /** Shows the error border and sets aria-invalid. The message itself comes from Field. */
  invalid?: boolean;
  /** Text before the value, in ink-muted: a unit like "€" or "#". For an icon use the `prefix` slot. */
  prefix?: string;
  /** Text after the value: a unit like "kg", "%", "pcs". For an icon use the `suffix` slot. */
  suffix?: string;
  /** end right-aligns the text — use for prices, quantities and other numbers. */
  align?: 'start' | 'end';
  /** Tabular figures so digits line up; use for prices, SKUs, quantities. */
  numeric?: boolean;
  /** Shows a clear (×) button while there is a value; pressing it empties the value and emits `clear`. */
  clearable?: boolean;
  /** Accessible name of the clear button. Default "Clear" — translate it ("Leeren"). */
  clearLabel?: string;
  /** Greyed out and skipped by Tab. Prefer readonly when people still need to read or copy the value. */
  disabled?: boolean;
  /** Shown and copyable, never editable: order numbers, generated SKUs, API keys. */
  readonly?: boolean;
  /** Sets the native required attribute. Inside a Field, set required on the Field for the marker. */
  required?: boolean;
  /** Inside a Field the Field's id wins; outside, pair it with your own <label for>. */
  id?: string;
  /** Native input type. Prefer "text" with inputmode="decimal" or "numeric" over "number". */
  type?: string;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<InputProps>(), {
  size: 'default',
  type: 'text',
  align: 'start',
  prefix: undefined,
  suffix: undefined,
  clearLabel: undefined,
  id: undefined,
});
const [model, modifiers] = defineModel<string | number | null>({
  set(v) {
    if (modifiers.trim && typeof v === 'string') return v.trim();
    if (modifiers.number && typeof v === 'string' && v !== '' && !Number.isNaN(Number(v))) return Number(v);
    return v;
  },
});
const emit = defineEmits<{
  /** The clear button was pressed (the value is already empty). */
  clear: [];
}>();
defineSlots<{
  /** Content before the text: a search icon, a unit. */
  prefix?(): unknown;
  /** Content after the text: a unit, a status icon. */
  suffix?(): unknown;
}>();

const attrs = useAttrs();
const slots = useSlots();
const field = useFieldControl();
const strings = useStrings('input', { clear: 'Clear' });
const input = ref<HTMLInputElement | null>(null);

const controlId = useControlId(field, () => props.id);
const isDisabled = computed(() => props.disabled || !!field?.value.disabled);
const isReadonly = computed(() => props.readonly || !!field?.value.readOnly);
const isInvalid = computed(
  () => props.invalid || !!field?.value.invalid || attrs['aria-invalid'] === true || attrs['aria-invalid'] === 'true',
);
const showClear = computed(
  () => props.clearable && !isDisabled.value && !isReadonly.value && model.value != null && model.value !== '',
);

if (import.meta.env.DEV && !controlId.value && !attrs['aria-label'] && !attrs['aria-labelledby']) {
  warnOnce(
    'input-label',
    'Input: give it a visible label — wrap it in Field, or pass id, aria-label or aria-labelledby.',
  );
}

const inputAttrs = computed<Record<string, unknown>>(() => {
  const { class: _c, style: _s, ...rest } = attrs;
  return {
    ...rest,
    id: controlId.value,
    type: props.type,
    disabled: isDisabled.value,
    readonly: isReadonly.value,
    required: props.required || undefined,
    'aria-required': field?.value.required ? 'true' : (rest['aria-required'] as string | undefined),
    'aria-describedby': joinIds(rest['aria-describedby'] as string | undefined, field?.value.describedBy),
    'aria-invalid': isInvalid.value ? 'true' : undefined,
  };
});

function onInput(e: Event) {
  model.value = (e.target as HTMLInputElement).value;
}
function clear() {
  model.value = '';
  emit('clear');
  input.value?.focus();
}
// Clicking the padding or an affix focuses the field, like a native input.
function onWrapperMouseDown(e: MouseEvent) {
  const t = e.target as HTMLElement;
  if (t === e.currentTarget || t.closest?.('.q-input__affix')) {
    e.preventDefault();
    if (!isDisabled.value) input.value?.focus();
  }
}

defineExpose({
  /** The native <input>. */
  input,
  focus: () => input.value?.focus(),
});
</script>

<template>
  <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -- mousedown on the frame (around affixes) focuses the input; the input itself takes keyboard focus -->
  <span
    :class="[
      'q-input',
      size === 'slim' && 'q-input--slim',
      size === 'large' && 'q-input--large',
      isInvalid && 'q-input--invalid',
      isDisabled && 'q-input--disabled',
      isReadonly && 'q-input--readonly',
      align === 'end' && 'q-input--end',
      numeric && 'q-input--numeric',
      attrs.class,
    ]"
    :style="attrs.style as any"
    @mousedown="onWrapperMouseDown"
  >
    <span v-if="slots.prefix || prefix != null" class="q-input__affix q-input__affix--start"
      ><slot name="prefix">{{ prefix }}</slot></span
    >
    <input ref="input" v-bind="inputAttrs" class="q-input__field" :value="model ?? ''" @input="onInput" />
    <button
      v-if="showClear"
      type="button"
      class="q-input__clear"
      :aria-label="clearLabel || strings.clear"
      @click="clear"
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <path d="M6 6l8 8M14 6l-8 8" />
      </svg>
    </button>
    <span v-if="slots.suffix || suffix != null" class="q-input__affix q-input__affix--end"
      ><slot name="suffix">{{ suffix }}</slot></span
    >
  </span>
</template>
