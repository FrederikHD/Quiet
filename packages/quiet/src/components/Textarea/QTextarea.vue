<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue';
import { fmt, useStrings } from '../../config';
import { useFormReset } from '../../composables/useFormReset';
import { useQuietId } from '../../composables/useQuietId';
import { joinIds, warnOnce } from '../../utils/dom';
import { useControlId, useFieldControl } from '../Field/context';

export interface TextareaStrings {
  count?: (n: number, max: number) => string;
  left?: (n: number) => string;
}
export interface TextareaProps {
  /** Starting height in lines. Default 4. */
  rows?: number;
  /** Grow with the text from rows up to maxRows, then scroll. */
  autoGrow?: boolean;
  /** With autoGrow: the most lines it grows to before it scrolls. Default: no limit. */
  maxRows?: number;
  /** A hard limit on the length, with a counter: "114 / 500", then "8 characters left" near the limit. */
  maxlength?: number;
  /** Shows the counter while maxlength is set. Default true. */
  showCount?: boolean;
  /** large: 24px lines and 16px text, for storefront forms. */
  size?: 'default' | 'large';
  /** Error border and aria-invalid; the message comes from Field. */
  invalid?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  /** Inside a Field the Field's id wins. */
  id?: string;
  /** The counter's words: count(n, max) "114 / 500" and left(n) "8 characters left". */
  strings?: TextareaStrings;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TextareaProps>(), {
  rows: 4,
  maxRows: undefined,
  maxlength: undefined,
  showCount: true,
  size: 'default',
  id: undefined,
  strings: undefined,
});
const model = defineModel<string | null>();

const attrs = useAttrs();
const field = useFieldControl();
const strings = useStrings<Required<TextareaStrings>>(
  'textarea',
  {
    count: (n, max) => `${fmt(n)} / ${fmt(max)}`,
    left: (n) => (n === 1 ? '1 character left' : `${fmt(n)} characters left`),
  },
  () => props.strings,
);
const el = ref<HTMLTextAreaElement | null>(null);
const counterId = useQuietId('q-textarea-count-');

const controlId = useControlId(field, () => props.id);
const isDisabled = computed(() => props.disabled || !!field?.value.disabled);
const isReadonly = computed(() => props.readonly || !!field?.value.readOnly);
const isInvalid = computed(
  () => props.invalid || !!field?.value.invalid || attrs['aria-invalid'] === true || attrs['aria-invalid'] === 'true',
);
const length = computed(() => String(model.value ?? '').length);
const hasCount = computed(() => props.maxlength != null && props.showCount);
const left = computed(() => (props.maxlength != null ? props.maxlength - length.value : 0));
// Read out only when it matters: the last 10% of the limit.
const near = computed(() => props.maxlength != null && left.value <= Math.max(10, Math.round(props.maxlength * 0.1)));

if (import.meta.env.DEV && !controlId.value && !attrs['aria-label'] && !attrs['aria-labelledby']) {
  warnOnce('textarea-label', 'Textarea: give it a label — wrap it in Field, or pass id, aria-label or aria-labelledby.');
}

// Grow with the text: measure the content height, between `rows` and `maxRows` lines.
function grow() {
  const t = el.value;
  if (!t || !props.autoGrow) return;
  const cs = getComputedStyle(t);
  const line = parseFloat(cs.lineHeight) || 22;
  const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
  t.style.height = 'auto';
  const maxH = props.maxRows ? props.maxRows * line + pad : Infinity;
  t.style.height = `${Math.max(props.rows * line + pad, Math.min(t.scrollHeight, maxH))}px`;
}
watch(model, () => nextTick(grow));
// A form reset empties the native textarea (its default is its text content, which Vue never sets); follow it.
useFormReset(el, () => {
  if (el.value && el.value.value !== String(model.value ?? '')) model.value = el.value.value;
});
let ro: ResizeObserver | null = null;
const onFonts = () => grow();
onMounted(() => {
  grow();
  if (!props.autoGrow || typeof ResizeObserver === 'undefined' || !el.value) return;
  let width = el.value.clientWidth;
  ro = new ResizeObserver(() => {
    if (el.value && el.value.clientWidth !== width) {
      width = el.value.clientWidth;
      grow();
    }
  });
  ro.observe(el.value);
  // The web font arriving changes line lengths, so measure again then.
  document.fonts?.addEventListener?.('loadingdone', onFonts);
});
onBeforeUnmount(() => {
  ro?.disconnect();
  document.fonts?.removeEventListener?.('loadingdone', onFonts);
});

const fieldAttrs = computed<Record<string, unknown>>(() => {
  const { class: _c, style: _s, ...rest } = attrs;
  return {
    ...rest,
    id: controlId.value,
    rows: props.rows,
    maxlength: props.maxlength,
    disabled: isDisabled.value,
    readonly: isReadonly.value,
    required: props.required || undefined,
    'aria-required': field?.value.required ? 'true' : rest['aria-required'],
    'aria-invalid': isInvalid.value ? 'true' : undefined,
    'aria-describedby': joinIds(rest['aria-describedby'] as string | undefined, field?.value.describedBy, hasCount.value && counterId),
  };
});

defineExpose({ textarea: el, focus: () => el.value?.focus() });
</script>

<template>
  <span
    :class="[
      'q-input',
      'q-textarea',
      size === 'large' && 'q-input--large',
      isInvalid && 'q-input--invalid',
      isDisabled && 'q-input--disabled',
      isReadonly && 'q-input--readonly',
      autoGrow && 'q-textarea--grow',
      attrs.class,
    ]"
    :style="attrs.style as any"
  >
    <!-- Also measured on focus: text settings people apply themselves (spacing, zoom) can change the height unnoticed. -->
    <textarea
      ref="el"
      v-bind="fieldAttrs"
      class="q-textarea__field"
      :value="model ?? ''"
      @input="model = ($event.target as HTMLTextAreaElement).value"
      @focus="grow"
    />
    <span v-if="hasCount" :id="counterId" :class="['q-textarea__count', near && 'is-near']" :aria-live="near ? 'polite' : 'off'">
      {{ near ? strings.left(Math.max(0, left)) : strings.count(length, maxlength!) }}
    </span>
  </span>
</template>
