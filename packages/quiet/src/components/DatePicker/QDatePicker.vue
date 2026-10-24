<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, useModel, watch } from 'vue';
import { useConfig, useStrings } from '../../config';
import { useFormReset } from '../../composables/useFormReset';
import { useQuietId } from '../../composables/useQuietId';
import QPopoverPanel from '../../internal/QPopoverPanel.vue';
import { useFieldControl } from '../Field/context';
import QIcon from '../Icon/QIcon.vue';
import QInput from '../Input/QInput.vue';
import {
  addDays,
  addMonths,
  dateShape,
  daysIn,
  formatFull,
  formatShort,
  fromParts,
  parseDate,
  toTime,
  today,
  weekStart,
  weekday,
} from './date';

export interface DatePickerStrings {
  /** The calendar button's name and the calendar's title. Default "Choose date". */
  choose?: string;
  /** Default "Previous month". */
  previousMonth?: string;
  /** Default "Next month". */
  nextMonth?: string;
  /** How the placeholder writes the parts of a date, in the locale's order: "DD/MM/YYYY", "TT.MM.JJJJ" in German. */
  day?: string;
  month?: string;
  year?: string;
}
export interface DatePickerProps {
  /** The date as an ISO string, "2026-10-24", or null while empty or while the typed text isn't a date that can be chosen. */
  modelValue?: string | null;
  /** The earliest date that can be chosen, "2026-10-24". */
  min?: string;
  /** The latest date that can be chosen. */
  max?: string;
  /** Rules out single dates, like Sundays or holidays: (iso) => boolean. They stay in the calendar, greyed out. */
  isDateDisabled?: (date: string) => boolean;
  /** Same sizes as Input. */
  size?: 'slim' | 'default' | 'large';
  /** Shows the error border. The message comes from Field. */
  invalid?: boolean;
  /** Shows a clear (×) button while there is a value. */
  clearable?: boolean;
  disabled?: boolean;
  /** Shown, never editable; the calendar button is hidden. */
  readonly?: boolean;
  required?: boolean;
  /** Inside a Field the Field's id wins. */
  id?: string;
  /** Submits the ISO date under this name with a native <form>. */
  name?: string;
  /** Translations; or once for the shop with configure({ strings: { datePicker } }). */
  strings?: DatePickerStrings;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DatePickerProps>(), {
  modelValue: undefined,
  min: undefined,
  max: undefined,
  isDateDisabled: undefined,
  size: 'default',
  id: undefined,
  name: undefined,
  strings: undefined,
});
const model = useModel(props, 'modelValue');
const emit = defineEmits<{
  /** The ISO date, or null. */
  'update:modelValue': [value: string | null];
  /**
   * Typed text that leaves no date: `format` when it isn't a date, `range` when it's before min or after max,
   * `unavailable` when isDateDisabled rules it out. The value is null and the text stays, for people to fix.
   */
  'invalid-text': [text: string, reason: 'format' | 'range' | 'unavailable'];
}>();

const attrs = useAttrs();
const config = useConfig();
const field = useFieldControl();
const strings = useStrings<Required<DatePickerStrings>>(
  'datePicker',
  {
    choose: 'Choose date',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    day: 'DD',
    month: 'MM',
    year: 'YYYY',
  },
  () => props.strings,
);
const locale = computed(() => config.locale);
const panelId = useQuietId('q-datepicker-');
const headingId = `${panelId}-heading`;

const isDisabled = computed(() => props.disabled || !!field?.value.disabled);
const isReadonly = computed(() => props.readonly || !!field?.value.readOnly);

const placeholder = computed(() => {
  const { order, separator } = dateShape(locale.value);
  return order.map((p) => strings.value[p]).join(separator);
});

// Whether a date can be chosen, and why not.
function problem(iso: string): 'range' | 'unavailable' | null {
  if ((props.min && iso < props.min) || (props.max && iso > props.max)) return 'range';
  return props.isDateDisabled?.(iso) ? 'unavailable' : null;
}
const isValidIso = (v: string | null | undefined): v is string => toTime(v) != null;

// The text in the field: the value as the locale writes it, or what someone is typing.
const text = ref(isValidIso(model.value) ? formatShort(model.value, locale.value) : '');
// A value set from outside replaces the text; the echo of our own set() doesn't, so typed text that isn't a date stays.
let ours: string | null | undefined = model.value;
watch(
  () => model.value,
  (v) => {
    if (v === ours) return;
    ours = v;
    text.value = isValidIso(v) ? formatShort(v, locale.value) : '';
  },
);
watch(locale, () => {
  if (isValidIso(model.value)) text.value = formatShort(model.value, locale.value);
});

function set(v: string | null) {
  ours = v;
  model.value = v;
}
function commit() {
  const t = text.value.trim();
  if (!t) {
    if (model.value != null) set(null);
    return;
  }
  const iso = parseDate(t, locale.value);
  const why = iso ? problem(iso) : 'format';
  if (!iso || why) {
    if (model.value != null) set(null);
    emit('invalid-text', t, why ?? 'format');
    return;
  }
  text.value = formatShort(iso, locale.value);
  if (iso !== model.value) set(iso);
}
function onText(v: string | number | null | undefined) {
  text.value = v == null ? '' : String(v);
  if (open.value) setOpen(false); // typing instead
  if (!text.value) commit(); // the clear button, or everything deleted
}

const inputCmp = ref<InstanceType<typeof QInput> | null>(null);
const box = computed<HTMLElement | null>(() => (inputCmp.value?.$el as HTMLElement | undefined) ?? null);
const nativeInput = computed(() => inputCmp.value?.input ?? null);
const button = ref<HTMLButtonElement | null>(null);
const initial = model.value ?? null;
useFormReset(nativeInput, () => set(initial));

// ---- The calendar ----
const open = ref(false);
const focusDate = ref(today());
const dayButtons = new Map<string, HTMLButtonElement>();
const initialFocus = ref<HTMLElement | null>(null);

function clamp(iso: string) {
  if (props.min && iso < props.min) return props.min;
  if (props.max && iso > props.max) return props.max;
  return iso;
}
// The day itself, or the next one that can be chosen (within a year), so focus doesn't start on a ruled-out Sunday.
function firstOpen(iso: string) {
  for (let d = iso, i = 0; i < 366 && (!props.max || d <= props.max); d = addDays(d, 1), i++) {
    if (!problem(d)) return d;
  }
  return iso;
}
function setOpen(next: boolean) {
  if (next && (isDisabled.value || isReadonly.value)) return;
  if (next) {
    commit();
    focusDate.value = firstOpen(clamp(isValidIso(model.value) ? model.value : today()));
    initialFocus.value = null;
    // Opened from the keyboard while the field is off-screen: bring it into view, or the panel closes at once.
    if (!open.value) box.value?.scrollIntoView?.({ block: 'nearest', behavior: 'instant' });
  }
  open.value = next;
}
function close() {
  setOpen(false);
  button.value?.focus();
}

const view = computed(() => {
  const [y, m] = focusDate.value.split('-').map(Number);
  return { year: y, month: m - 1 };
});
const heading = computed(() =>
  new Intl.DateTimeFormat(locale.value, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    Date.UTC(view.value.year, view.value.month, 1),
  ),
);
const firstDay = computed(() => weekStart(locale.value));
const weekdays = computed(() => {
  const short = new Intl.DateTimeFormat(locale.value, { weekday: 'short', timeZone: 'UTC' });
  const long = new Intl.DateTimeFormat(locale.value, { weekday: 'long', timeZone: 'UTC' });
  // 4 January 2026 was a Sunday.
  return Array.from({ length: 7 }, (_, i) => {
    const t = Date.UTC(2026, 0, 4 + ((firstDay.value + i) % 7));
    return { short: short.format(t), long: long.format(t) };
  });
});
interface Day {
  iso: string;
  day: number;
  label: string;
  disabled: boolean;
  /** Ruled out by isDateDisabled, not by min or max. */
  unavailable: boolean;
  selected: boolean;
  today: boolean;
}
const weeks = computed<(Day | null)[][]>(() => {
  const { year, month } = view.value;
  const first = fromParts(year, month, 1);
  const lead = (weekday(first) - firstDay.value + 7) % 7;
  const now = today();
  const cells: (Day | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= daysIn(year, month); d++) {
    const iso = fromParts(year, month, d);
    const why = problem(iso);
    cells.push({
      iso,
      day: d,
      label: formatFull(iso, locale.value),
      disabled: why != null,
      unavailable: why === 'unavailable',
      selected: iso === model.value,
      today: iso === now,
    });
  }
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
});
const canPrev = computed(() => !props.min || fromParts(view.value.year, view.value.month, 1) > props.min);
const canNext = computed(
  () =>
    !props.max || fromParts(view.value.year, view.value.month, daysIn(view.value.year, view.value.month)) < props.max,
);

function dayRef(iso: string, el: unknown) {
  if (el) dayButtons.set(iso, el as HTMLButtonElement);
  else dayButtons.delete(iso);
}
// The panel focuses initialFocus once it's placed: the selected day, else today.
watch(open, async (o) => {
  if (!o) return;
  await nextTick();
  initialFocus.value = dayButtons.get(focusDate.value) ?? null;
});

async function moveTo(iso: string) {
  focusDate.value = clamp(iso);
  await nextTick();
  dayButtons.get(focusDate.value)?.focus();
}
function month(delta: number) {
  // The buttons keep focus; the grid's focus day follows, so Tab lands on it.
  focusDate.value = clamp(addMonths(focusDate.value, delta));
}
function choose(d: Day) {
  if (d.disabled) return;
  set(d.iso);
  text.value = formatShort(d.iso, locale.value);
  close();
}
function onGridKeyDown(e: KeyboardEvent) {
  const f = focusDate.value;
  const back = (weekday(f) - firstDay.value + 7) % 7;
  const moves: Record<string, () => string> = {
    ArrowLeft: () => addDays(f, -1),
    ArrowRight: () => addDays(f, 1),
    ArrowUp: () => addDays(f, -7),
    ArrowDown: () => addDays(f, 7),
    Home: () => addDays(f, -back),
    End: () => addDays(f, 6 - back),
    PageUp: () => addMonths(f, e.shiftKey ? -12 : -1),
    PageDown: () => addMonths(f, e.shiftKey ? 12 : 1),
  };
  const move = moves[e.key];
  if (!move) return;
  e.preventDefault();
  void moveTo(move());
}

// Alt+↓ opens the calendar from the field, as in a native date field.
function onFieldKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') commit();
  else if (e.key === 'ArrowDown' && e.altKey) {
    e.preventDefault();
    setOpen(true);
  }
}

const inputAttrs = computed(() => ({
  autocomplete: 'off',
  inputmode: 'numeric',
  placeholder: placeholder.value,
  ...attrs,
}));

defineExpose({
  /** The native <input>. */
  input: nativeInput,
  focus: () => nativeInput.value?.focus(),
  open: () => setOpen(true),
  close,
});
</script>

<template>
  <QInput
    v-bind="inputAttrs"
    :id="id"
    ref="inputCmp"
    :class="['q-datepicker', open && 'is-open']"
    :model-value="text"
    :size="size"
    :invalid="invalid"
    :clearable="clearable"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    @update:model-value="onText"
    @blur="commit"
    @keydown="onFieldKeyDown"
  >
    <template v-if="!isReadonly" #suffix>
      <button
        ref="button"
        type="button"
        class="q-datepicker__button"
        :aria-label="strings.choose"
        aria-haspopup="dialog"
        :aria-expanded="open"
        :aria-controls="open ? panelId : undefined"
        :disabled="isDisabled"
        @click="setOpen(!open)"
      >
        <QIcon name="calendar" />
      </button>
    </template>
  </QInput>
  <input v-if="name" type="hidden" :name="name" :value="model ?? ''" />
  <QPopoverPanel
    :id="panelId"
    :open="open"
    kind="dialog"
    :label="strings.choose"
    :anchor="box"
    :trigger="button"
    align="end"
    :initial-focus="initialFocus"
    panel-class="q-datepicker__panel"
    @close="(returnFocus) => (returnFocus ? close() : setOpen(false))"
  >
    <div class="q-datepicker__head">
      <button
        type="button"
        class="q-datepicker__nav"
        :aria-label="strings.previousMonth"
        :disabled="!canPrev"
        @click="month(-1)"
      >
        <QIcon name="chevron-left" />
      </button>
      <h2 :id="headingId" class="q-datepicker__title" aria-live="polite">{{ heading }}</h2>
      <button
        type="button"
        class="q-datepicker__nav"
        :aria-label="strings.nextMonth"
        :disabled="!canNext"
        @click="month(1)"
      >
        <QIcon name="chevron-right" />
      </button>
    </div>
    <!-- eslint-disable-next-line vuejs-accessibility/interactive-supports-focus -- one day button in the grid is in the tab order (roving tabindex); the grid itself isn't a stop -->
    <table class="q-datepicker__grid" role="grid" :aria-labelledby="headingId" @keydown="onGridKeyDown">
      <thead>
        <tr>
          <th v-for="w in weekdays" :key="w.long" scope="col" :abbr="w.long">{{ w.short }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, i) in weeks" :key="i">
          <template v-for="(d, j) in week" :key="d?.iso ?? `e${i}-${j}`">
            <td v-if="d" role="gridcell" :aria-selected="d.selected ? 'true' : undefined">
              <button
                :ref="(el) => dayRef(d.iso, el)"
                type="button"
                :class="[
                  'q-datepicker__day',
                  d.selected && 'is-selected',
                  d.today && 'is-today',
                  d.disabled && 'is-disabled',
                  d.unavailable && 'is-unavailable',
                ]"
                :tabindex="d.iso === focusDate ? 0 : -1"
                :aria-label="d.label"
                :aria-current="d.today ? 'date' : undefined"
                :aria-disabled="d.disabled ? 'true' : undefined"
                @click="choose(d)"
                @focus="focusDate = d.iso"
              >
                {{ d.day }}
              </button>
            </td>
            <td v-else role="gridcell" />
          </template>
        </tr>
      </tbody>
    </table>
  </QPopoverPanel>
</template>
