<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, watch } from 'vue';
import { fmt, useStrings } from '../../config';
import { useFormReset } from '../../composables/useFormReset';
import { useQuietId } from '../../composables/useQuietId';
import QPopoverPanel from '../../internal/QPopoverPanel.vue';
import { joinIds, warnOnce } from '../../utils/dom';
import QDialog from '../Dialog/QDialog.vue';
import { provideNoField, useControlId, useFieldControl } from '../Field/context';
import QIcon from '../Icon/QIcon.vue';
import type { IconName } from '../Icon/icons';
import QTag from '../Tag/QTag.vue';
import QComboboxPanel from './QComboboxPanel.vue';
import {
  normalizeText,
  type ComboboxOption,
  type ComboboxResult,
  type ComboboxSearch,
  type ComboboxStrings,
} from './types';

export interface ComboboxProps {
  /** Static options, filtered in the browser (case- and accent-insensitive). Use this or `search`. */
  options?: ComboboxOption[];
  /** Fetch options: called on open with "" and after typing stops. Superseded requests are aborted via signal. */
  search?: ComboboxSearch;
  /** Milliseconds to wait after typing before `search`. Default 250. */
  debounce?: number;
  /** Most options shown at once. Default 50. */
  limit?: number;
  /** Pick several values: chosen ones show as tags in the box. */
  multiple?: boolean;
  /** Tags shown before "+N more" (multiple). Default 5. */
  maxChips?: number;
  /** Shows a × to clear the choice (single). */
  clearable?: boolean;
  /** Shown in the closed box while nothing is chosen ("Choose a product"). */
  placeholder?: string;
  /** Placeholder of the search field in the open panel. Default "Search". */
  searchPlaceholder?: string;
  /** Same sizes as Input and Select: default follows data-density (40/32px), slim 28px, large 48px. */
  size?: 'slim' | 'default' | 'large';
  /** Error border and aria-invalid; the message comes from Field. */
  invalid?: boolean;
  /** Greyed out, skipped by Tab and can't be opened. */
  disabled?: boolean;
  /** Shown like a read-only Input (ink on a sunken box, no chevron); can't be opened. */
  readonly?: boolean;
  /** Read out on the search field (aria-required). */
  required?: boolean;
  /** An icon before the value. */
  prefixIcon?: IconName;
  /** Adds hidden inputs with the chosen values, for plain form posts. */
  name?: string;
  /** Where the list opens. auto (default): a dropdown under the field; on screens under 640px a Dialog. always: a Dialog everywhere. never: always a dropdown. */
  dialog?: 'auto' | 'always' | 'never';
  /** Id of the trigger button. Inside a Field the Field's id wins. */
  id?: string;
  /** Translations of the built-in words: status line, Clear, Done, "Remove …", "+N more". */
  strings?: ComboboxStrings;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ComboboxProps>(), {
  options: undefined,
  search: undefined,
  debounce: 250,
  limit: 50,
  maxChips: 5,
  placeholder: undefined,
  searchPlaceholder: undefined,
  size: 'default',
  prefixIcon: undefined,
  name: undefined,
  dialog: 'auto',
  id: undefined,
  strings: undefined,
});
/** The chosen option object (single) or an array of them (multiple) — objects, so labels survive fetched results. */
const model = defineModel<ComboboxOption | ComboboxOption[] | null>();

const attrs = useAttrs();
const field = useFieldControl();
provideNoField(); // the search field inside is not the Field's control
const strings = useStrings<Required<ComboboxStrings>>(
  'combobox',
  {
    searchPlaceholder: 'Search',
    noResults: (q) => (q ? `No matches for “${q}”` : 'Nothing to choose from'),
    showing: (shown, total) => `Showing ${fmt(shown)} of ${fmt(total)}. Type to search for more.`,
    results: (n) => (n === 1 ? '1 result' : `${fmt(n)} results`),
    loading: 'Searching…',
    error: 'Couldn’t load the results.',
    retry: 'Try again',
    done: 'Done',
    clear: 'Clear',
    remove: (label) => `Remove ${label}`,
    more: (n) => `+${n} more`,
    selected: (n) => `${n} selected`,
  },
  () => props.strings,
);

const baseId = useQuietId('q-combo-');
const ownId = useControlId(field, () => props.id);
const triggerId = computed(() => ownId.value ?? `${baseId}-trigger`);
const listId = `${baseId}-list`;
const valueId = `${baseId}-value`;
const statusId = `${baseId}-status`;
const panelId = `${baseId}-panel`;

const isReadonly = computed(() => (props.readonly || !!field?.value.readOnly) && !props.disabled);
const isDisabled = computed(() => props.disabled || !!field?.value.disabled || isReadonly.value);
const isInvalid = computed(
  () => props.invalid || !!field?.value.invalid || attrs['aria-invalid'] === true || attrs['aria-invalid'] === 'true',
);
const isRequired = computed(
  () =>
    props.required || !!field?.value.required || attrs['aria-required'] === true || attrs['aria-required'] === 'true',
);

if (!props.id && !field && !attrs['aria-label'] && !attrs['aria-labelledby']) {
  warnOnce('combo-label', 'Combobox: give it a label — wrap it in Field, or pass aria-label.');
}

const selected = computed<ComboboxOption[]>(() =>
  props.multiple
    ? ((model.value as ComboboxOption[] | null | undefined) ?? [])
    : model.value
      ? [model.value as ComboboxOption]
      : [],
);
const isSelected = (o: ComboboxOption) => selected.value.some((s) => s.value === o.value);
const isEmpty = computed(() => selected.value.length === 0);
const initial = model.value ?? (props.multiple ? [] : null);

const open = ref(false);
const inDialog = ref(false);
const query = ref('');
const active = ref(-1);
const retryTick = ref(0);
const fetched = ref<ComboboxResult>({ options: [], total: null, status: 'idle' });

const box = ref<HTMLElement | null>(null);
const trigger = ref<HTMLButtonElement | null>(null);

useFormReset(trigger, () => {
  model.value = Array.isArray(initial) ? [...initial] : initial;
});

// Static options: filtered here (accent- and case-insensitive), the first `limit` shown.
const result = computed<ComboboxResult>(() => {
  if (props.search) return fetched.value;
  const all = props.options ?? [];
  const nq = normalizeText(query.value.trim());
  const matched = !nq
    ? all
    : all.filter((o) => normalizeText(`${o.label} ${o.description ?? ''} ${o.keywords ?? ''}`).includes(nq));
  return { options: matched.slice(0, props.limit), total: matched.length, status: 'done' };
});

// Fetched options: debounced, aborted when superseded; only the latest answer counts.
let request = 0;
watch([open, query, retryTick], (_v, _o, onCleanup) => {
  if (!open.value || !props.search) return;
  const id = ++request;
  const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  fetched.value = { ...fetched.value, status: 'loading' };
  const q = query.value.trim();
  const timer = setTimeout(
    () => {
      Promise.resolve()
        .then(() => props.search!(q, { signal: ctl?.signal }))
        .then(
          (out) => {
            if (id !== request) return;
            const list = Array.isArray(out) ? out : (out?.options ?? []);
            const total = !Array.isArray(out) && out?.total != null ? out.total : list.length;
            fetched.value = { options: list.slice(0, props.limit), total, status: 'done' };
          },
          (err: unknown) => {
            if (id !== request || (err as Error)?.name === 'AbortError') return;
            fetched.value = { ...fetched.value, status: 'error' };
          },
        );
    },
    q ? props.debounce : 0,
  );
  onCleanup(() => {
    clearTimeout(timer);
    ctl?.abort();
  });
});

function firstEnabled(from: number, dir: 1 | -1) {
  const items = result.value.options;
  for (let i = from; i >= 0 && i < items.length; i += dir) if (!items[i].disabled) return i;
  return -1;
}
watch([() => result.value.options, open], () => (active.value = firstEnabled(0, 1)));

// Status line under the list; also read out by screen readers.
const statusText = computed(() => {
  const r = result.value;
  const shown = r.options.length;
  const total = r.total ?? shown;
  const q = query.value.trim();
  if (r.status === 'loading') return strings.value.loading;
  if (r.status === 'error') return strings.value.error;
  if (total === 0) return strings.value.noResults(q);
  if (total > shown) return strings.value.showing(shown, total);
  return strings.value.results(total);
});

function labelText(): string {
  const el = document.getElementById(`${triggerId.value}-label`);
  if (!el) return '';
  let t = '';
  for (const n of Array.from(el.childNodes)) {
    if (n.nodeType === 3) t += n.textContent;
    else if (n.nodeType === 1 && !(n as Element).matches('.q-field__req, .q-field__opt')) t += n.textContent;
  }
  return t.trim();
}
const dialogLabel = ref('');

function setOpen(next: boolean) {
  if (isDisabled.value) return;
  // Phones (or dialog="always"): open in a Dialog. Elsewhere: a dropdown under the field.
  if (next) {
    inDialog.value = props.dialog === 'always' || (props.dialog !== 'never' && window.innerWidth < 640);
    dialogLabel.value = labelText() || (attrs['aria-label'] as string) || strings.value.searchPlaceholder;
  }
  open.value = next;
  if (!next) query.value = '';
}
function close() {
  setOpen(false);
  trigger.value?.focus();
}

function choose(o: ComboboxOption) {
  if (o.disabled) return;
  if (props.multiple) {
    model.value = isSelected(o) ? selected.value.filter((s) => s.value !== o.value) : [...selected.value, o];
  } else {
    model.value = o;
    close();
  }
}
function remove(o: ComboboxOption) {
  model.value = selected.value.filter((s) => s.value !== o.value);
  trigger.value?.focus();
}
function clear() {
  model.value = null;
  trigger.value?.focus();
}

function onSearchKeyDown(e: KeyboardEvent) {
  const items = result.value.options;
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    const dir = e.key === 'ArrowDown' ? 1 : -1;
    let next = firstEnabled(active.value + dir, dir);
    if (next === -1) next = firstEnabled(dir === 1 ? 0 : items.length - 1, dir);
    if (next !== -1) active.value = next;
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (active.value >= 0 && items[active.value]) choose(items[active.value]);
  }
}

// Like a select: ↓ / ↑ open the list; typing a letter opens it and starts the search with that letter.
async function onTriggerKeyDown(e: KeyboardEvent) {
  if (e.defaultPrevented || isDisabled.value || open.value) return;
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    setOpen(true);
  } else if (e.key.length === 1 && e.key !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault();
    setOpen(true);
    await nextTick();
    query.value = e.key;
  }
}
// Clicking the box's padding or chevron opens it like the button does.
function onBoxMouseDown(e: MouseEvent) {
  if (isDisabled.value) return;
  const t = e.target as Element;
  if (t === e.currentTarget || t.closest?.('.q-select__chevron')) {
    e.preventDefault();
    trigger.value?.focus();
    setOpen(!open.value);
  }
}

const optionText = (o: ComboboxOption) => o.label ?? o.value;
const display = computed(() =>
  props.multiple || isEmpty.value ? (isEmpty.value ? props.placeholder : null) : optionText(selected.value[0]),
);
const srValue = computed(() =>
  props.multiple && !isEmpty.value
    ? `${strings.value.selected(selected.value.length)}: ${selected.value.map(optionText).join(', ')}`
    : null,
);

const triggerAttrs = computed<Record<string, unknown>>(() => {
  const { class: _c, style: _s, 'aria-required': _r, ...rest } = attrs;
  const labelled = rest['aria-label'] || rest['aria-labelledby'];
  return {
    ...rest,
    id: triggerId.value,
    disabled: isDisabled.value,
    'aria-labelledby': labelled ? rest['aria-labelledby'] : `${triggerId.value}-label ${valueId}`,
    'aria-describedby': joinIds(
      rest['aria-describedby'] as string | undefined,
      field?.value.describedBy,
      rest['aria-label'] ? valueId : null,
    ),
    'aria-invalid': isInvalid.value ? 'true' : undefined,
    'aria-expanded': String(open.value),
    // The dropdown panel; on phones the list opens in a modal Dialog instead, which takes focus itself.
    'aria-controls': open.value && !inDialog.value ? panelId : undefined,
    'aria-haspopup': 'dialog',
  };
});

// The open panel's content, the same in the dropdown and the phone dialog.
const panelBindings = computed(() => ({
  listId,
  statusId,
  label: dialogLabel.value,
  query: query.value,
  active: active.value,
  result: result.value,
  multiple: props.multiple,
  required: isRequired.value,
  searchPlaceholder: props.searchPlaceholder ?? strings.value.searchPlaceholder,
  statusText: statusText.value,
  emptyText: strings.value.noResults(query.value.trim()),
  clearLabel: strings.value.clear,
  retryLabel: strings.value.retry,
  isSelected,
  'onUpdate:query': (v: string) => (query.value = v),
  'onUpdate:active': (i: number) => (active.value = i),
  onChoose: choose,
  onKeydown: onSearchKeyDown,
  onRetry: () => retryTick.value++,
}));

defineExpose({ focus: () => trigger.value?.focus(), open: () => setOpen(true), close });
</script>

<template>
  <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -- mousedown on the box only keeps focus on the trigger; the trigger button is the keyboard path -->
  <div
    ref="box"
    :class="[
      'q-input',
      'q-select',
      'q-combo',
      multiple && 'q-combo--multi',
      multiple && !isEmpty && 'q-combo--has-chips',
      size === 'slim' && 'q-input--slim',
      size === 'large' && 'q-input--large',
      isInvalid && 'q-input--invalid',
      isReadonly ? 'q-input--readonly' : isDisabled && 'q-input--disabled',
      prefixIcon && 'q-select--prefixed',
      attrs.class,
    ]"
    :style="attrs.style as any"
    @mousedown="onBoxMouseDown"
  >
    <span v-if="prefixIcon" class="q-input__affix q-input__affix--start" aria-hidden="true"
      ><QIcon :name="prefixIcon"
    /></span>
    <template v-if="multiple">
      <QTag
        v-for="o in selected.slice(0, maxChips)"
        :key="o.value"
        variant="field"
        removable
        :remove-label="strings.remove(optionText(o))"
        :disabled="isDisabled"
        @remove="remove(o)"
      >
        {{ optionText(o) }}
      </QTag>
      <span v-if="selected.length > maxChips" class="q-tag q-tag--field q-tag--more" aria-hidden="true">
        {{ strings.more(selected.length - maxChips) }}
      </span>
    </template>
    <button
      ref="trigger"
      v-bind="triggerAttrs"
      type="button"
      class="q-combo__trigger"
      @click="setOpen(!open)"
      @keydown="onTriggerKeyDown"
    >
      <span
        :id="valueId"
        :class="['q-combo__value', isEmpty && 'q-combo__value--placeholder', srValue && 'q-visually-hidden']"
      >
        {{ srValue || display || '\u00a0' }}
      </span>
    </button>
    <button
      v-if="!multiple && clearable && !isEmpty && !isDisabled"
      type="button"
      class="q-input__clear q-combo__clear"
      :aria-label="strings.clear"
      @click="clear"
    >
      <QIcon name="x" />
    </button>
    <span class="q-select__chevron" aria-hidden="true"><QIcon name="chevron-down" /></span>
    <template v-if="name">
      <input v-for="o in selected" :key="`h${o.value}`" type="hidden" :name="name" :value="o.value" />
    </template>

    <QPopoverPanel
      :id="panelId"
      :open="open && !inDialog"
      kind="dialog"
      :label="dialogLabel || strings.searchPlaceholder"
      :anchor="box"
      :trigger="trigger"
      match-anchor-width
      :min-width="280"
      flush
      fit-height
      panel-class="q-combo__popover"
      @close="(returnFocus) => (returnFocus ? close() : setOpen(false))"
    >
      <QComboboxPanel v-bind="panelBindings" />
    </QPopoverPanel>
    <QDialog
      :open="open && inDialog"
      :title="dialogLabel"
      mobile="inset"
      size="md"
      flush
      :close-text="strings.done"
      @close="close"
    >
      <QComboboxPanel v-bind="panelBindings" />
    </QDialog>
  </div>
</template>
