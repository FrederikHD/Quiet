<script setup lang="ts">
import { computed, ref } from 'vue';
import { currencySymbol, money, useConfig, useStrings } from '../../config';
import { useQuietId } from '../../composables/useQuietId';
import QField from '../Field/QField.vue';
import QFieldGroup from '../FieldGroup/QFieldGroup.vue';
import QInput from '../Input/QInput.vue';

export interface PriceRangeStrings {
  label?: string;
  from?: string;
  to?: string;
  /** Names the lower handle. */
  minimum?: string;
  /** Names the upper handle. */
  maximum?: string;
}
export interface PriceRangeProps {
  /** The cheapest price in the list: the left end of the track. */
  min: number;
  /** The dearest price in the list: the right end of the track. */
  max: number;
  /** Handles and typed prices snap to it. Default 1. */
  step?: number;
  /** The group's label. Default "Price". */
  label?: string;
  /** Keeps the label for screen readers only — when a filter heading already says "Price". */
  labelHidden?: boolean;
  /** ISO code for the symbol in the fields and the handles' spoken value; defaults to the configured currency. */
  currency?: string;
  /** Disables both handles and both fields. */
  disabled?: boolean;
  /** Overrides the texts, e.g. for another language. */
  strings?: PriceRangeStrings;
}

const props = withDefaults(defineProps<PriceRangeProps>(), {
  step: 1,
  label: undefined,
  currency: undefined,
  strings: undefined,
});
/** [from, to]: updated on every move of a handle and every committed field. */
const model = defineModel<[number, number]>({ required: true });
const emit = defineEmits<{
  /** A moved handle was let go (pointer or key released), or a typed price committed — apply the filter here. */ commit: [
    value: [number, number],
  ];
}>();

const strings = useStrings<Required<PriceRangeStrings>>(
  'priceRange',
  { label: 'Price', from: 'From', to: 'To', minimum: 'Minimum price', maximum: 'Maximum price' },
  () => props.strings,
);
const id = useQuietId('q-range-');
const lo = computed(() => Math.max(props.min, Math.min(model.value?.[0] ?? props.min, props.max)));
const hi = computed(() => Math.min(props.max, Math.max(model.value?.[1] ?? props.max, props.min)));
const sym = computed(() => currencySymbol(props.currency));
// Typing is a draft until the field is left or Enter is pressed.
const draft = ref<[string | null, string | null]>([null, null]);
const pct = (n: number) => (props.max === props.min ? 0 : ((n - props.min) / (props.max - props.min)) * 100);

function emitValue(a: number, b: number, done = false) {
  model.value = [a, b];
  if (done) emit('commit', [a, b]);
}
function commitSlide() {
  if (!moved) return;
  moved = false;
  emit('commit', [lo.value, hi.value]);
}
// A typed price in the shop's locale: "1.000,50" in de-DE, "1,000.50" in en-US. The locale's group separator
// counts as one only before three digits; otherwise ("42,4" typed in en) it is taken as the decimal point.
const config = useConfig();
function parseLocal(raw: string) {
  const parts = new Intl.NumberFormat(config.locale).formatToParts(11111.1);
  const group = parts.find((p) => p.type === 'group')?.value ?? '';
  const decimal = parts.find((p) => p.type === 'decimal')?.value ?? '.';
  let t = raw.trim();
  if (group) {
    const esc = group.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    t = t
      .replace(new RegExp(`${esc}(?=\\d{3}(?!\\d))`, 'g'), '')
      .split(group)
      .join('.');
  }
  return parseFloat(t.split(decimal).join('.'));
}
function commitField(which: 0 | 1) {
  const raw = draft.value[which];
  draft.value = which === 0 ? [null, draft.value[1]] : [draft.value[0], null];
  if (raw == null) return;
  let n = parseLocal(raw);
  if (Number.isNaN(n)) return;
  n = Math.round(n / props.step) * props.step;
  if (which === 0) emitValue(Math.max(props.min, Math.min(n, hi.value)), hi.value, true);
  else emitValue(lo.value, Math.min(props.max, Math.max(n, lo.value)), true);
}
function onDraft(which: 0 | 1, v: unknown) {
  const next: [string | null, string | null] = [...draft.value];
  next[which] = String(v ?? '').replace(/[^\d.,]/g, '');
  draft.value = next;
}
// A handle moved since the last commit: letting go (or releasing the key) commits once, and Tab or a click that
// moves nothing doesn't refilter.
let moved = false;
function onSlide(which: 0 | 1, e: Event) {
  const input = e.target as HTMLInputElement;
  const n = +input.value;
  const v = which === 0 ? Math.min(n, hi.value) : Math.max(n, lo.value);
  // Pushed against the other handle: stay there (the native input would pass it).
  if (v !== n) input.value = String(v);
  // Nothing changed (an arrow key against the other handle): no update and no second commit.
  if (v === (which === 0 ? lo.value : hi.value)) return;
  moved = true;
  if (which === 0) emitValue(v, hi.value);
  else emitValue(lo.value, v);
}
// Both handles in one spot: the one on top is the one that can move away. In the right half that's the lower one
// (at the max end the upper one can't go anywhere).
const lowerOnTop = computed(() => lo.value === hi.value && pct(lo.value) > 50);
const fieldValue = (which: 0 | 1) => draft.value[which] ?? String(which === 0 ? lo.value : hi.value);
</script>

<template>
  <!-- Two native range inputs over one track, so keyboard, screen readers and touch work as on any slider. -->
  <div
    class="q-range"
    role="group"
    :aria-labelledby="labelHidden ? undefined : `${id}-label`"
    :aria-label="labelHidden ? (label ?? strings.label) : undefined"
  >
    <span v-if="!labelHidden" :id="`${id}-label`" class="q-field__label">{{ label ?? strings.label }}</span>
    <div class="q-range__track" :style="{ '--q-lo': `${pct(lo)}%`, '--q-hi': `${pct(hi)}%` }">
      <span class="q-range__fill" aria-hidden="true" />
      <input
        v-for="which in [0, 1] as const"
        :key="which"
        type="range"
        :class="['q-range__thumb', which === 0 && lowerOnTop && 'is-top']"
        :min="min"
        :max="max"
        :step="step"
        :value="which === 0 ? lo : hi"
        :disabled="disabled"
        :aria-label="which === 0 ? strings.minimum : strings.maximum"
        :aria-valuetext="money(which === 0 ? lo : hi, currency)"
        @input="onSlide(which, $event)"
        @pointerup="commitSlide"
        @keyup="commitSlide"
      />
    </div>
    <QFieldGroup class="q-range__fields" :columns="[1, 1]" stack="late">
      <QField
        v-for="which in [0, 1] as const"
        :id="`${id}-${which}`"
        :key="which"
        :label="which === 0 ? strings.from : strings.to"
        :disabled="disabled"
      >
        <QInput
          :model-value="fieldValue(which)"
          inputmode="decimal"
          numeric
          :prefix="sym.after ? undefined : sym.symbol"
          :suffix="sym.after ? sym.symbol : undefined"
          @update:model-value="onDraft(which, $event)"
          @blur="commitField(which)"
          @keydown.enter.prevent="commitField(which)"
        />
      </QField>
    </QFieldGroup>
  </div>
</template>
