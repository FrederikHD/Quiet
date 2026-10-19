<script setup lang="ts">
import { computed, nextTick, provide, ref, useSlots, watch } from 'vue';
import { useQuietId } from '../../composables/useQuietId';
import { useResizeObserver } from '../../composables/useResizeObserver';
import QFieldHelp from '../../internal/QFieldHelp.vue';
import QFieldMarker from '../../internal/QFieldMarker.vue';
import QFieldMessage from '../../internal/QFieldMessage.vue';
import { flattenNodes, joinIds, textOf } from '../../utils/dom';
import { GROUP_KEY, useFieldSetup, type FieldCommonProps, type GroupContext } from '../Field/context';

export interface FieldGroupProps extends FieldCommonProps {
  /** Relative widths, e.g. [2, 1] for Postcode | City, or CSS track sizes. Default: equal. The fields stack when there isn't room. */
  columns?: (number | string)[];
  /** Joins the controls into one: no gap, a single shared border, only the outer corners rounded — Prefix | Next number, Country code | Phone. Each part keeps a 72px floor and the larger parts give way. */
  connected?: boolean;
  /** auto (default): the row stacks once its narrowest field would be under about 100px. late: rows of short values (L × W × H, hh:mm) stay a row down to about 88px per field, with tighter input padding. */
  stack?: 'auto' | 'late';
  /** Disables every field in the group. */
  disabled?: boolean;
  /** Keeps the group label for screen readers only. */
  labelHidden?: boolean;
  /** Put on the group; an error-summary link to it lands on its first control. */
  id?: string;
}

const props = withDefaults(defineProps<FieldGroupProps>(), {
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
  columns: undefined,
  stack: 'auto',
  id: undefined,
});
defineSlots<{
  /** Fields shown side by side. Their labels always sit above them. */
  default(): unknown;
  /** Rich group label instead of `label`. */
  label?(): unknown;
  /** Rich help content instead of `help`. */
  help?(): unknown;
  /** Rich hint content instead of `hint`. */
  hint?(): unknown;
}>();

const slots = useSlots();
const { strings: fstrings, placement, markers, summaryShown, status } = useFieldSetup(props);
const autoId = useQuietId('q-fgroup-');
const groupId = computed(() => props.id ?? autoId);
const labelId = computed(() => `${groupId.value}-label`);
const hintId = computed(() => `${groupId.value}-hint`);
const msgId = computed(() => `${groupId.value}-msg`);
const hasHint = computed(() => !!props.hint || !!slots.hint);
const labelled = computed(() => props.label != null || !!slots.label);

const ctx = computed<GroupContext>(() => ({
  describedBy: joinIds(status.value[0] && msgId.value, hasHint.value && hintId.value),
  invalid: status.value[0] === 'error',
  disabled: !!props.disabled,
}));
provide(GROUP_KEY, ctx);

// Stack when the narrowest column would get too small to use: ~100px for ordinary fields, ~88px for stack="late".
// Measured, so weighted columns ([3, 1]) are judged by their smallest part. Connected rows are one control: each part
// keeps a floor (72px, or what a select needs for its longest option) and they only come apart when even that won't fit.
const controls = ref<HTMLElement | null>(null);
const stacked = ref(false);
const floors = ref<number[]>([]);
let canvas: CanvasRenderingContext2D | null = null;

function weights(count: number): number[] {
  const cols = props.columns ?? Array.from({ length: count }, () => 1);
  return cols.map((c) => (typeof c === 'number' && c > 0 ? c : 1));
}
function measureFloors(row: Element): number[] {
  return Array.from(row.children).map((field) => {
    const sel = field.querySelector<HTMLSelectElement>('select.q-select__field');
    if (!sel) return 72;
    canvas ??= document.createElement('canvas').getContext('2d');
    if (!canvas) return 96;
    const cs = getComputedStyle(sel);
    canvas.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    let widest = 0;
    for (const o of Array.from(sel.options)) if (!o.hidden) widest = Math.max(widest, canvas.measureText(o.text).width);
    const bs = getComputedStyle(sel.parentElement!);
    return Math.ceil(
      widest +
        parseFloat(cs.paddingLeft) +
        parseFloat(cs.paddingRight) +
        parseFloat(bs.borderLeftWidth) +
        parseFloat(bs.borderRightWidth) +
        2,
    );
  });
}
function check() {
  const el = controls.value;
  const row = el?.firstElementChild;
  if (!el || !row) return;
  const fr = weights(row.children.length);
  if (props.connected) {
    const next = measureFloors(row);
    if (next.join() !== floors.value.join()) floors.value = next;
  }
  const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
  const avail = el.clientWidth - gap * (fr.length - 1);
  const minFrac = Math.min(...fr) / fr.reduce((a, b) => a + b, 0);
  const floorSum = floors.value.reduce((a, b) => a + b, 0);
  stacked.value =
    fr.length > 1 &&
    (props.connected ? avail < floorSum + 8 * fr.length : avail * minFrac < (props.stack === 'late' ? 88 : 100));
  if (!hasSubgrid()) levelLabels(row);
}
useResizeObserver(controls, check);
watch(
  () => [props.columns, props.connected, props.stack],
  () => nextTick(check),
  { deep: true },
);

const hasSubgrid = () => typeof CSS !== 'undefined' && !!CSS.supports?.('grid-template-rows', 'subgrid');
// Browsers without subgrid: give every label in the row the height of the tallest, so the controls stay level.
function levelLabels(row: Element) {
  const cols = Array.from(
    row.querySelectorAll<HTMLElement>(':scope > .q-field > .q-field__layout > .q-field__labelcol'),
  );
  for (const c of cols) {
    c.style.minHeight = '';
    c.style.alignItems = '';
  }
  if (stacked.value) return;
  const max = Math.max(0, ...cols.map((c) => c.getBoundingClientRect().height));
  for (const c of cols) {
    c.style.minHeight = `${max}px`;
    c.style.alignItems = 'flex-end';
  }
}

// The grid's columns, from `columns` or one equal column per field.
function template(): string {
  const count = flattenNodes(slots.default?.() as never).length || 1;
  const cols = props.columns ?? Array.from({ length: count }, () => 1);
  return cols
    .map((c, i) =>
      typeof c !== 'number' ? c : props.connected ? `minmax(${floors.value[i] ?? 72}px, ${c}fr)` : `minmax(0, ${c}fr)`,
    )
    .join(' ');
}
</script>

<template>
  <div
    :id="id"
    :class="[
      'q-field',
      'q-fgroup',
      `q-field--${placement}`,
      !labelled && 'q-fgroup--unlabelled',
      stack === 'late' && 'q-fgroup--late',
      connected && 'q-fgroup--connected',
      stacked && 'q-fgroup--stacked',
      disabled && 'q-field--disabled',
    ]"
    :role="labelled ? 'group' : undefined"
    :aria-labelledby="labelled ? labelId : undefined"
    :style="labelWidth ? { '--q-label-w': labelWidth } : undefined"
  >
    <div class="q-field__layout">
      <div :class="['q-field__labelcol', labelHidden && 'q-visually-hidden']">
        <span v-if="labelled" :id="labelId" class="q-field__label">
          <slot name="label">{{ label }}</slot
          ><QFieldMarker :markers="markers" :required="required" :strings="fstrings" />
        </span>
        <QFieldHelp
          v-if="labelled && (help || slots.help)"
          :help="help"
          :label="label ?? textOf(slots.label?.())"
          :prefix="fstrings.help"
        >
          <slot v-if="slots.help" name="help" />
        </QFieldHelp>
      </div>
      <div class="q-field__controlcol">
        <div ref="controls" class="q-fgroup__controls">
          <div class="q-fgroup__row" :style="{ gridTemplateColumns: template() }"><slot /></div>
        </div>
        <QFieldMessage :id="msgId" :status="status[0]" :message="status[1]" :strings="fstrings" :quiet="summaryShown" />
        <div v-if="hasHint" :id="hintId" class="q-field__hint">
          <slot name="hint">{{ hint }}</slot>
        </div>
      </div>
    </div>
  </div>
</template>
