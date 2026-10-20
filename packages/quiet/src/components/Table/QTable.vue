<script setup lang="ts" generic="Row extends Record<string, any>">
import { computed, getCurrentInstance, ref, useSlots } from 'vue';
import { fmt, useStrings } from '../../config';
import { useQuietId } from '../../composables/useQuietId';
import { useResizeObserver } from '../../composables/useResizeObserver';
import { warnOnce } from '../../utils/dom';
import QButton from '../Button/QButton.vue';
import QCheckbox from '../Checkbox/QCheckbox.vue';
import { provideNoField } from '../Field/context';
import QIcon from '../Icon/QIcon.vue';
import QSelect from '../Select/QSelect.vue';
import { compareValues, type RowKey, type TableColumn, type TableSort, type TableStrings } from './types';

export interface TableProps<R> {
  /** Names the table: "Orders". Required. */
  caption: string;
  /** Hide the caption visually when a heading above says the same. */
  captionHidden?: boolean;
  /** The columns: { key, header, format, numeric, sortable, … }. Falsy entries are skipped, so a column can be added conditionally. Rich cells and headers use the #cell-<key> and #header-<key> slots. */
  columns: (TableColumn<R> | null | false)[];
  /** The rows on this page (up to 100; page through the rest with a Pagination in the footer). */
  rows: R[];
  /** Key per row: a field name (default "id") or a function. */
  rowKey?: string | ((row: R) => RowKey);
  /** Names the row in its checkbox ("Select order #10421"). Default: the primary column's text. */
  rowLabel?: (row: R) => string;
  /** The initial sort when v-model:sort isn't bound. */
  defaultSort?: TableSort | null;
  /** The rows arrive sorted (server data): the table only shows the sort state. */
  manualSort?: boolean;
  /** Adds a checkbox column, select all and the bulk bar. */
  selectable?: boolean;
  /** The initially selected row keys when v-model:selected isn't bound. */
  defaultSelected?: RowKey[];
  /** Rows it returns false for can't be selected; their checkbox is disabled. */
  isRowSelectable?: (row: R) => boolean;
  /** All rows matching the current query (across pages). With v-model:all-matching (or @update:all-matching) bound, it enables "Select all 1,240". */
  totalCount?: number;
  /** The primary column becomes a link; a click anywhere on the row follows it. */
  rowHref?: (row: R) => string;
  /** Makes rows clickable: the primary column becomes a button and a click anywhere on the row calls it (also after a rowHref link click, so a router can take over). */
  onRowClick?: (row: R, event: MouseEvent) => void;
  /** Dims the rows and sets aria-busy; with no rows it shows skeleton rows. */
  loading?: boolean;
  /** How many skeleton rows to show while loading with no rows yet. */
  skeletonRows?: number;
  /** Under 640px (the table's own width): scroll (default) sideways with the first column pinned, or cards. */
  mobile?: 'scroll' | 'cards';
  /** Scroll mode: pin the first column (with its checkbox) while the rest scrolls, when it is the primary column. Default true. */
  pinFirst?: boolean;
  /** Scrolls the body inside this height (a number in px, or a CSS length); the header row stays. */
  maxHeight?: number | string;
  /** Row height: comfortable (56px) or compact (40px). Default: the nearest data-density. */
  density?: 'comfortable' | 'compact';
  /** Translations; or once for the shop with configure(). */
  strings?: TableStrings;
}

const props = withDefaults(defineProps<TableProps<Row>>(), {
  rowKey: 'id',
  rowLabel: undefined,
  defaultSort: undefined,
  defaultSelected: undefined,
  isRowSelectable: undefined,
  totalCount: undefined,
  rowHref: undefined,
  onRowClick: undefined,
  skeletonRows: 5,
  mobile: 'scroll',
  pinFirst: true,
  maxHeight: undefined,
  density: undefined,
  strings: undefined,
});
/** The sort shown (and applied, unless manualSort). */
const sortModel = defineModel<TableSort | null>('sort');
/** Selected row keys. */
const selectedModel = defineModel<RowKey[]>('selected');
/** "Select all 1,240": every row matching the query is selected, not just this page. */
const allMatching = defineModel<boolean>('allMatching', { default: false });

defineSlots<
  {
    /** A rich caption; the caption prop still names the table. */
    caption?(): unknown;
    /** Search and filters above the table (slim controls). */
    toolbar?(): unknown;
    /** Below the table, usually a Pagination. */
    footer?(): unknown;
    /** Shown when there are no rows. */
    empty?(): unknown;
    /** Slim ghost icon Buttons for the last column; name the row in each aria-label. */
    'row-actions'?(props: { row: Row; index: number }): unknown;
    /** Slim Buttons shown in the bulk bar while rows are selected. */
    'bulk-actions'?(props: { selected: RowKey[]; allMatching: boolean }): unknown;
  } & {
    /** A rich cell: #cell-status="{ row }". */
    [K in `cell-${string}`]?: (props: { row: Row; index: number; value: unknown }) => unknown;
  } & {
    /** A rich header: #header-total. */
    [K in `header-${string}`]?: () => unknown;
  }
>();

// Uncontrolled: start from defaultSort / defaultSelected.
if (sortModel.value === undefined && props.defaultSort) sortModel.value = { ...props.defaultSort };
if (selectedModel.value === undefined && props.defaultSelected) selectedModel.value = [...props.defaultSelected];
const sort = computed({ get: () => sortModel.value ?? null, set: (v) => (sortModel.value = v) });
const selected = computed({ get: () => selectedModel.value ?? [], set: (v) => (selectedModel.value = v) });

provideNoField();
const slots = useSlots();
const strings = useStrings<Required<TableStrings>>(
  'table',
  {
    selectAll: 'Select all rows on this page',
    selectAllShort: 'Select all',
    selectRow: (label) => `Select ${label}`,
    selected: (n) => `${fmt(n)} selected`,
    selectAllMatching: (total) => `Select all ${fmt(total)}`,
    allMatchingSelected: (total) => `All ${fmt(total)} selected`,
    clearSelection: 'Clear selection',
    actions: 'Actions',
    empty: 'No results',
    loading: 'Loading…',
    sortBy: 'Sort by',
    sortOption: (header, dir) => `${header}${dir === 'asc' ? ', ascending' : ', descending'}`,
  },
  () => props.strings,
);
const captionId = `${useQuietId('q-table-')}-caption`;
if (!props.caption)
  warnOnce('table-caption', 'Table: pass a caption — it names the table for screen readers ("Orders").');

const columns = computed(() => props.columns.filter((c): c is TableColumn<Row> => !!c));
const primary = computed(() => columns.value.find((c) => c.primary) ?? columns.value[0]);
const clickable = computed(() => !!props.onRowClick || !!props.rowHref);
const hasActions = computed(() => !!slots['row-actions']);

const keyOf = (row: Row, i: number): RowKey => {
  const k = typeof props.rowKey === 'function' ? props.rowKey(row) : row[props.rowKey];
  return (k ?? i) as RowKey;
};
const cellText = (c: TableColumn<Row>, row: Row, i: number) => (c.format ? c.format(row, i) : row[c.key]);
const rowLabel = (row: Row) =>
  props.rowLabel ? props.rowLabel(row) : primary.value ? String(cellText(primary.value, row, 0) ?? '') : '';

// Sorting: the table sorts the rows itself unless manualSort. Empty values stay last either way.
function toggleSort(c: TableColumn<Row>) {
  const first = c.sortFirst ?? (c.numeric ? 'desc' : 'asc');
  const direction = sort.value?.key === c.key ? (sort.value.direction === 'asc' ? 'desc' : 'asc') : first;
  sort.value = { key: c.key, direction };
}
const shown = computed(() => {
  const s = sort.value;
  const sc = s && !props.manualSort ? columns.value.find((c) => c.key === s.key) : undefined;
  if (!s || !sc) return props.rows;
  const mul = s.direction === 'desc' ? -1 : 1;
  const value = (r: Row) => (sc.sortValue ? sc.sortValue(r) : r[sc.key]);
  return props.rows
    .map((r, i) => [r, i] as const)
    .sort(([a, ai], [b, bi]) => {
      const av = value(a);
      const bv = value(b);
      const empty = av == null || av === '' || bv == null || bv === '';
      return (empty ? compareValues(av, bv) : compareValues(av, bv) * mul) || ai - bi;
    })
    .map(([r]) => r);
});

// Selection: row keys. Select all works on this page; "Select all 1,240" goes beyond it.
const pageKeys = computed(() => shown.value.map(keyOf));
const selectableKeys = computed(() =>
  pageKeys.value.filter((_k, i) => !props.isRowSelectable || props.isRowSelectable(shown.value[i])),
);
const selOnPage = computed(() => selectableKeys.value.filter((k) => selected.value.includes(k)).length);
const allOnPage = computed(() => selectableKeys.value.length > 0 && selOnPage.value === selectableKeys.value.length);
const someOnPage = computed(() => selOnPage.value > 0 && !allOnPage.value);
function toggleAll(on: boolean) {
  if (on) selected.value = [...selected.value, ...selectableKeys.value.filter((k) => !selected.value.includes(k))];
  else {
    selected.value = selected.value.filter((k) => !selectableKeys.value.includes(k));
    allMatching.value = false;
  }
}
function toggleRow(k: RowKey, on: boolean) {
  if (on) {
    if (!selected.value.includes(k)) selected.value = [...selected.value, k];
  } else {
    selected.value = selected.value.filter((x) => x !== k);
    allMatching.value = false;
  }
}
function clearSelection() {
  selected.value = [];
  allMatching.value = false;
}
const count = computed(() =>
  allMatching.value && props.totalCount != null ? props.totalCount : selected.value.length,
);
const selectionText = computed(() =>
  !count.value
    ? ''
    : allMatching.value && props.totalCount != null
      ? strings.value.allMatchingSelected(props.totalCount)
      : strings.value.selected(count.value),
);
// "Select all 1,240" only when the app listens for it: otherwise nothing acts on the query, only on this page's keys.
const instance = getCurrentInstance();
const listensForAllMatching = () =>
  !!(instance?.vnode.props?.['onUpdate:allMatching'] || instance?.vnode.props?.['onUpdate:all-matching']);
const canSelectAllMatching = computed(
  () =>
    allOnPage.value &&
    !allMatching.value &&
    props.totalCount != null &&
    props.totalCount > selectableKeys.value.length &&
    listensForAllMatching(),
);

// Horizontal scroll: is there any? Then the region takes keyboard focus (to scroll) and the pinned column gets an edge.
const scroller = ref<HTMLElement | null>(null);
const overflowing = ref(false);
const scrolled = ref(false);
useResizeObserver(
  scroller,
  () => {
    const el = scroller.value;
    if (!el) return;
    overflowing.value = el.scrollWidth > el.clientWidth + 1;
    scrolled.value = el.scrollLeft > 0;
    // Keep a focused cell clear of the pinned column and of the sticky header row.
    let w = 0;
    el.querySelectorAll('thead .is-pinned').forEach((p) => (w += p.getBoundingClientRect().width));
    el.style.scrollPaddingInlineStart = w ? `${Math.ceil(w)}px` : '';
    const head = el.querySelector('thead');
    el.style.scrollPaddingTop =
      head && el.scrollHeight > el.clientHeight + 1 ? `${Math.ceil(head.getBoundingClientRect().height)}px` : '';
  },
  () => [scroller.value?.firstElementChild],
);

// Clickable rows: the primary column holds the real link or button; a click anywhere else on the row follows it.
const INTERACTIVE =
  'a, button, input, select, textarea, label, summary, [role="button"], [role="checkbox"], [data-row-click="ignore"]';
function onRowAreaClick(e: MouseEvent) {
  if (!clickable.value || e.defaultPrevented) return;
  if ((e.target as Element).closest?.(INTERACTIVE)) return;
  if (String(window.getSelection?.() ?? '').length) return; // selecting text, not opening the row
  const link = (e.currentTarget as Element).querySelector('.q-table__link');
  link?.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: e.view,
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
    }),
  );
}

const pin = computed(() => props.mobile === 'scroll' && props.pinFirst && primary.value === columns.value[0]);
const colCount = computed(() => columns.value.length + (props.selectable ? 1 : 0) + (hasActions.value ? 1 : 0));
const alignClass = (c: TableColumn<Row>) =>
  c.numeric || c.align === 'end' ? 'is-end' : c.align === 'center' ? 'is-center' : null;
const skelWidth = (r: number, ci: number) => `${ci === 0 ? 60 + ((r * 37) % 30) : 30 + ((r * 13 + ci * 29) % 40)}%`;

// Phones in cards mode: no header row, so select-all and sorting move into a small bar above the cards.
const sortable = computed(() => columns.value.filter((c) => c.sortable));
const sortOptions = computed(() =>
  sortable.value.flatMap((c) => {
    const labels = c.sortLabels ?? [
      strings.value.sortOption(c.header, 'asc'),
      strings.value.sortOption(c.header, 'desc'),
    ];
    return [
      { value: `${c.key}:asc`, label: labels[0] },
      { value: `${c.key}:desc`, label: labels[1] },
    ];
  }),
);
function onMobileSort(v: string | null | undefined) {
  const [key, direction] = String(v ?? '').split(':');
  if (key) sort.value = { key, direction: direction === 'desc' ? 'desc' : 'asc' };
}
const maxHeightCss = computed(() =>
  props.maxHeight == null ? undefined : typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight,
);
</script>

<template>
  <div
    :class="[
      'q-table',
      `q-table--${mobile}`,
      selectable && 'q-table--selectable',
      hasActions && 'q-table--actions',
      loading && 'is-loading',
    ]"
    :data-density="density"
  >
    <!-- eslint-disable vuejs-accessibility/no-redundant-roles -- explicit table roles keep the semantics when the phone
         card layout changes display: browsers drop a table's roles once its elements stop displaying as table parts. -->
    <div class="q-table__frame">
      <div v-if="slots.toolbar" class="q-table__toolbar"><slot name="toolbar" /></div>
      <div v-if="mobile === 'cards' && (selectable || sortable.length)" class="q-table__mobilebar">
        <QCheckbox
          v-if="selectable"
          :label="strings.selectAllShort"
          :model-value="allOnPage"
          :indeterminate="someOnPage"
          :disabled="!selectableKeys.length"
          @update:model-value="toggleAll"
        />
        <span v-else />
        <QSelect
          v-if="sortable.length"
          size="slim"
          :aria-label="strings.sortBy"
          :placeholder="strings.sortBy"
          class="q-table__mobilesort"
          :model-value="sort ? `${sort.key}:${sort.direction}` : ''"
          :options="sortOptions"
          @update:model-value="onMobileSort"
        />
      </div>
      <div v-if="selectable && count" class="q-table__bulk">
        <span class="q-table__bulk-count">{{ selectionText }}</span>
        <QButton
          v-if="canSelectAllMatching"
          size="slim"
          variant="ghost"
          class="q-table__bulk-all"
          @click="allMatching = true"
        >
          {{ strings.selectAllMatching(totalCount!) }}
        </QButton>
        <div class="q-table__bulk-actions">
          <slot name="bulk-actions" :selected="selected" :all-matching="allMatching" />
          <QButton size="slim" variant="ghost" @click="clearSelection">{{ strings.clearSelection }}</QButton>
        </div>
      </div>
      <!-- Announces selection changes; the visible count above can come and go. -->
      <div v-if="selectable" class="q-visually-hidden" role="status">{{ selectionText }}</div>
      <!-- A scrolling region must be reachable by keyboard (and named) so it can be scrolled without a mouse. -->
      <div
        ref="scroller"
        :class="['q-table__scroll', scrolled && 'is-scrolled']"
        :style="maxHeightCss ? { maxHeight: maxHeightCss } : undefined"
        :tabindex="overflowing ? 0 : undefined"
        :role="overflowing ? 'region' : undefined"
        :aria-labelledby="overflowing ? captionId : undefined"
        @scroll="scrolled = ($event.currentTarget as HTMLElement).scrollLeft > 0"
      >
        <!-- A real <table>, with explicit roles so it stays a table to screen readers when phones show cards. -->
        <table
          class="q-table__table"
          role="table"
          :aria-busy="loading ? 'true' : undefined"
          :aria-labelledby="captionId"
        >
          <caption :id="captionId" :class="['q-table__caption', captionHidden && 'q-visually-hidden']">
            <slot name="caption">{{ caption }}</slot>
          </caption>
          <thead role="rowgroup" class="q-table__head">
            <tr role="row">
              <th v-if="selectable" role="columnheader" scope="col" :class="['q-table__select', pin && 'is-pinned']">
                <QCheckbox
                  :label="strings.selectAll"
                  label-hidden
                  :model-value="allOnPage"
                  :indeterminate="someOnPage"
                  :disabled="!selectableKeys.length"
                  @update:model-value="toggleAll"
                />
              </th>
              <th
                v-for="(c, ci) in columns"
                :key="c.key"
                role="columnheader"
                scope="col"
                :aria-sort="sort?.key === c.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined"
                :class="[
                  'q-table__th',
                  alignClass(c),
                  c.sortable && 'is-sortable',
                  sort?.key === c.key && 'is-sorted',
                  pin && ci === 0 && 'is-pinned is-pinned-last',
                ]"
                :style="c.width || c.minWidth ? { width: c.width, minWidth: c.minWidth } : undefined"
              >
                <button v-if="c.sortable" type="button" class="q-table__sort" @click="toggleSort(c)">
                  <span class="q-table__sort-label"
                    ><slot :name="`header-${c.key}`">{{ c.header }}</slot></span
                  >
                  <span class="q-table__sort-icon" aria-hidden="true">
                    <QIcon :name="sort?.key === c.key && sort.direction === 'asc' ? 'chevron-up' : 'chevron-down'" />
                  </span>
                </button>
                <slot v-else :name="`header-${c.key}`">{{ c.header }}</slot>
              </th>
              <th v-if="hasActions" role="columnheader" scope="col" class="q-table__actions">
                <span class="q-visually-hidden">{{ strings.actions }}</span>
              </th>
            </tr>
          </thead>
          <tbody role="rowgroup" class="q-table__body">
            <template v-if="loading && !shown.length">
              <tr
                v-for="r in skeletonRows"
                :key="`sk${r}`"
                role="row"
                class="q-table__row q-table__row--skeleton"
                aria-hidden="true"
              >
                <td v-if="selectable" role="cell" class="q-table__select" />
                <td v-for="(c, ci) in columns" :key="c.key" role="cell" :class="alignClass(c)">
                  <span class="q-table__skel" :style="{ width: skelWidth(r - 1, ci) }" />
                </td>
                <td v-if="hasActions" role="cell" class="q-table__actions" />
              </tr>
            </template>
            <tr v-else-if="!shown.length" role="row" class="q-table__row q-table__row--empty">
              <td role="cell" :colspan="colCount" class="q-table__empty">
                <slot name="empty">{{ strings.empty }}</slot>
              </td>
            </tr>
            <tr
              v-for="(row, i) in shown"
              v-else
              :key="String(pageKeys[i])"
              role="row"
              :class="[
                'q-table__row',
                (allMatching || selected.includes(pageKeys[i])) && 'is-selected',
                clickable && 'is-clickable',
              ]"
              @click="onRowAreaClick"
            >
              <td v-if="selectable" role="cell" :class="['q-table__select', pin && 'is-pinned']">
                <QCheckbox
                  :label="strings.selectRow(rowLabel(row))"
                  label-hidden
                  :model-value="allMatching || selected.includes(pageKeys[i])"
                  :disabled="!!isRowSelectable && !isRowSelectable(row)"
                  @update:model-value="toggleRow(pageKeys[i], $event)"
                />
              </td>
              <component
                :is="c === primary ? 'th' : 'td'"
                v-for="(c, ci) in columns"
                :key="c.key"
                :role="c === primary ? 'rowheader' : 'cell'"
                :scope="c === primary ? 'row' : undefined"
                :data-label="c.header"
                :class="[
                  'q-table__cell',
                  alignClass(c),
                  c.numeric && 'is-numeric',
                  c === primary && 'q-table__primary',
                  c.truncate && 'is-truncate',
                  c.wrap && 'is-wrap',
                  c.mobile === false && 'is-hidden-mobile',
                  pin && ci === 0 && 'is-pinned is-pinned-last',
                ]"
                :title="c.truncate && !slots[`cell-${c.key}`] ? String(cellText(c, row, i) ?? '') : undefined"
              >
                <component
                  :is="rowHref ? 'a' : 'button'"
                  v-if="c === primary && clickable"
                  class="q-table__link"
                  :href="rowHref ? rowHref(row) : undefined"
                  :type="rowHref ? undefined : 'button'"
                  @click="props.onRowClick?.(row, $event)"
                >
                  <span
                    v-if="c.truncate"
                    class="q-table__trunc"
                    :style="typeof c.truncate === 'string' ? { maxWidth: c.truncate } : undefined"
                  >
                    <slot :name="`cell-${c.key}`" :row="row" :index="i" :value="row[c.key]">{{
                      cellText(c, row, i)
                    }}</slot>
                  </span>
                  <slot v-else :name="`cell-${c.key}`" :row="row" :index="i" :value="row[c.key]">{{
                    cellText(c, row, i)
                  }}</slot>
                </component>
                <template v-else>
                  <span
                    v-if="c.truncate"
                    class="q-table__trunc"
                    :style="typeof c.truncate === 'string' ? { maxWidth: c.truncate } : undefined"
                  >
                    <slot :name="`cell-${c.key}`" :row="row" :index="i" :value="row[c.key]">{{
                      cellText(c, row, i)
                    }}</slot>
                  </span>
                  <slot v-else :name="`cell-${c.key}`" :row="row" :index="i" :value="row[c.key]">{{
                    cellText(c, row, i)
                  }}</slot>
                </template>
              </component>
              <td v-if="hasActions" role="cell" class="q-table__actions">
                <div class="q-table__actions-inner"><slot name="row-actions" :row="row" :index="i" /></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="loading" class="q-visually-hidden" role="status">{{ strings.loading }}</div>
      <div v-if="slots.footer" class="q-table__footer"><slot name="footer" /></div>
    </div>
  </div>
</template>
