<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { fmt, useStrings } from '../../config';
import { useQuietId } from '../../composables/useQuietId';
import QButton from '../Button/QButton.vue';
import { provideNoField } from '../Field/context';
import QInput from '../Input/QInput.vue';
import QSelect from '../Select/QSelect.vue';

export interface PaginationStrings {
  label?: string;
  range?: (from: number, to: number, total: number) => string;
  rangeOpen?: (from: number, to: number) => string;
  previous?: string;
  next?: string;
  first?: string;
  last?: string;
  perPage?: string;
  /** Name of a page button: "Page 6". */
  page?: (page: number) => string;
  /** Announced when the range is hidden: "Page 6 of 25". */
  pageOf?: (page: number, pages: number) => string;
  /** The compact display: "6 / 25". */
  compact?: (page: number, pages: number) => string;
  /** Jump field: "Page" [6] "of 25". */
  jumpLabel?: string;
  of?: (pages: number) => string;
}
export interface PaginationProps {
  /** Total rows. Leave out for cursor-based APIs and pass hasNext instead (always the simple variant then). */
  total?: number;
  /** Without a total (cursor-based APIs): whether there is a next page. Overrides the one worked out from total. */
  hasNext?: boolean;
  /** simple (default): range + previous/next. pages: 1 … 4 5 6 … 25. compact: 6 / 25. pages and compact need total. */
  variant?: 'simple' | 'pages' | 'compact';
  /** pages variant: page numbers either side of the current one. Default 1. */
  siblings?: number;
  /** « and » for the first and last page (hidden under 400px). Needs total. */
  showFirstLast?: boolean;
  /** The page number becomes a field: Enter or leaving it goes there. Needs total. */
  jumpToPage?: boolean;
  /** Show the range, "1–50 of 1,240". Default true. */
  showRange?: boolean;
  /** The rows-per-page choices, e.g. [25, 50, 100]: shows a select bound to v-model:page-size. */
  pageSizeOptions?: number[];
  /** Show the rows-per-page select. Default true when pageSizeOptions are set. */
  showPageSize?: boolean;
  /** Where the controls sit; between puts the range on the left and the buttons on the right. */
  align?: 'end' | 'start' | 'center' | 'between';
  /** Button size: slim (default), default, large (storefront). */
  size?: 'slim' | 'default' | 'large';
  /** Disables the controls while a page loads and sets aria-busy; the current page stays enabled. */
  disabled?: boolean;
  /** Render the controls as links (pages that load from the server). Clicks still emit update:page; prevent them for client-side routing. */
  hrefFor?: (page: number) => string;
  /** Translations; or once for the shop with configure(). */
  strings?: PaginationStrings;
}

const props = withDefaults(defineProps<PaginationProps>(), {
  total: undefined,
  hasNext: undefined,
  variant: 'simple',
  siblings: 1,
  showRange: true,
  showPageSize: true,
  pageSizeOptions: undefined,
  align: 'end',
  size: 'slim',
  hrefFor: undefined,
  strings: undefined,
});
/** 1-based page. */
const page = defineModel<number>('page', { default: 1 });
/** Rows per page (default 50); v-model:page-size with pageSizeOptions. */
const pageSizeModel = defineModel<number>('pageSize', { default: 50 });

provideNoField();
const strings = useStrings<Required<PaginationStrings>>(
  'pagination',
  {
    label: 'Pagination',
    range: (from, to, total) => `${fmt(from)}–${fmt(to)} of ${fmt(total)}`,
    rangeOpen: (from, to) => `${fmt(from)}–${fmt(to)}`,
    previous: 'Previous page',
    next: 'Next page',
    first: 'First page',
    last: 'Last page',
    perPage: 'Rows per page',
    page: (n) => `Page ${fmt(n)}`,
    pageOf: (n, pages) => `Page ${fmt(n)} of ${fmt(pages)}`,
    compact: (n, pages) => `${fmt(n)} / ${fmt(pages)}`,
    jumpLabel: 'Page',
    of: (pages) => `of ${fmt(pages)}`,
  },
  () => props.strings,
);

const perPage = computed(() => pageSizeModel.value || 50);
const pages = computed(() => (props.total != null ? Math.max(1, Math.ceil(props.total / perPage.value)) : null));
const current = computed(() => Math.max(1, Math.min(page.value || 1, pages.value ?? Infinity)));
const from = computed(() => (props.total === 0 ? 0 : (current.value - 1) * perPage.value + 1));
const to = computed(() =>
  props.total != null ? Math.min(props.total, current.value * perPage.value) : current.value * perPage.value,
);
const hasPrev = computed(() => current.value > 1);
const hasNextPage = computed(() => props.hasNext ?? (pages.value != null && current.value < pages.value));
// Numbered pages and first/last need the total; without it Pagination stays simple.
const variant = computed(() =>
  pages.value != null && (props.variant === 'pages' || props.variant === 'compact') ? props.variant : 'simple',
);
const firstLast = computed(() => props.showFirstLast && pages.value != null);
const rangeText = computed(() =>
  props.total != null
    ? strings.value.range(from.value, to.value, props.total)
    : strings.value.rangeOpen(from.value, to.value),
);
// What screen readers hear when the page changes: the range, or the page when the range is hidden.
const announce = computed(() =>
  props.showRange
    ? rangeText.value
    : pages.value != null
      ? strings.value.pageOf(current.value, pages.value)
      : strings.value.page(current.value),
);

// Page numbers with gaps: 1 … 4 5 6 … 25 (always the first and last page, `siblings` either side of the current one).
const pageItems = computed<(number | 'gap-start' | 'gap-end')[]>(() => {
  const n = pages.value ?? 1;
  const s = props.siblings;
  const range = (a: number, b: number) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i);
  if (n <= 5 + s * 2) return range(1, n);
  const start = Math.max(Math.min(current.value - s, n - 1 - s * 2 - 1), 3);
  const end = Math.min(Math.max(current.value + s, 1 + s * 2 + 2), n - 2);
  return [
    1,
    ...(start > 3 ? ['gap-start' as const] : [2]),
    ...range(start, end),
    ...(end < n - 2 ? ['gap-end' as const] : [n - 1]),
    n,
  ];
});

const root = ref<HTMLElement | null>(null);
let moved = false;
function go(p: number) {
  const next = Math.max(1, pages.value ? Math.min(p, pages.value) : p);
  if (next !== current.value) page.value = next;
}
function nav(p: number) {
  if (props.disabled) return;
  moved = true;
  go(p);
}
// The button pressed may disappear or turn disabled on the new page (Next on the last page): keep focus inside,
// on the current page or the nearest enabled control.
watch(current, async () => {
  if (!moved) return;
  moved = false;
  await nextTick();
  const r = root.value;
  const a = document.activeElement as HTMLButtonElement | null;
  if (!r || (a && r.contains(a) && !a.disabled)) return;
  const next =
    r.querySelector<HTMLElement>('[aria-current="page"]') ??
    r.querySelector<HTMLElement>('.q-pager__controls button:not([disabled]), .q-pager__controls a[href]');
  next?.focus();
});

// Jump to a page: the page number as a small field (Enter or leaving the field goes there).
const draft = ref(String(current.value));
watch(current, (p) => (draft.value = String(p)));
function commitJump() {
  const n = parseInt(draft.value.replace(/[^0-9]/g, ''), 10);
  if (Number.isNaN(n) || pages.value == null) {
    draft.value = String(current.value);
    return;
  }
  const clamped = Math.max(1, Math.min(n, pages.value));
  draft.value = String(clamped);
  if (clamped !== current.value) {
    moved = true;
    go(clamped);
  }
}
const jumpId = useQuietId('q-pager-jump-');
const sizeId = useQuietId('q-pager-size-');
const showJump = computed(() => props.jumpToPage && pages.value != null);
const showSize = computed(() => props.showPageSize && !!props.pageSizeOptions?.length);
const href = (p: number, enabled = true) =>
  props.hrefFor && enabled && !props.disabled ? props.hrefFor(p) : undefined;
</script>

<template>
  <nav
    ref="root"
    :class="['q-pager', `q-pager--${variant}`, showJump && 'q-pager--jump', disabled && 'is-disabled']"
    :aria-label="strings.label"
    :aria-busy="disabled ? 'true' : undefined"
  >
    <div :class="['q-pager__row', `q-pager__row--${align}`]">
      <div v-if="showSize || showRange" class="q-pager__info">
        <span v-if="showSize" class="q-pager__size">
          <label :for="sizeId" class="q-pager__size-label">{{ strings.perPage }}</label>
          <QSelect
            :id="sizeId"
            :size="props.size"
            :model-value="String(perPage)"
            :options="pageSizeOptions!.map(String)"
            :disabled="disabled"
            @update:model-value="pageSizeModel = Number($event)"
          />
        </span>
        <span v-if="showRange" class="q-pager__range" aria-hidden="true">{{ rangeText }}</span>
      </div>
      <div class="q-pager__controls">
        <QButton
          v-if="firstLast"
          :size="props.size"
          class="q-pager__first"
          icon-start="chevrons-left"
          :aria-label="strings.first"
          :disabled="disabled || !hasPrev"
          :href="href(1, hasPrev)"
          @click="nav(1)"
        />
        <QButton
          :size="props.size"
          class="q-pager__prev"
          icon-start="chevron-left"
          :aria-label="strings.previous"
          :disabled="disabled || !hasPrev"
          :href="href(current - 1, hasPrev)"
          @click="nav(current - 1)"
        />

        <template v-if="variant === 'pages'">
          <span class="q-pager__pages">
            <template v-for="it in pageItems" :key="it">
              <span v-if="typeof it === 'string'" class="q-pager__gap" aria-hidden="true">…</span>
              <QButton
                v-else
                :size="props.size"
                variant="ghost"
                :class="['q-pager__page', it === current && 'is-current']"
                :aria-current="it === current ? 'page' : undefined"
                :aria-label="strings.page(it)"
                :disabled="disabled && it !== current"
                :href="href(it)"
                @click="it !== current && nav(it)"
              >
                {{ fmt(it) }}
              </QButton>
            </template>
          </span>
        </template>
        <!-- Too narrow for the numbers (or the compact variant): "4 / 25", or the jump field. -->
        <span
          v-if="variant !== 'simple' || showJump"
          :class="['q-pager__compact', variant === 'pages' && 'q-pager__compact--fallback']"
        >
          <span v-if="showJump" class="q-pager__jump">
            <label :for="jumpId" class="q-pager__jump-label">{{ strings.jumpLabel }}</label>
            <QInput
              :id="jumpId"
              v-model="draft"
              :size="props.size"
              numeric
              align="end"
              inputmode="numeric"
              :disabled="disabled"
              class="q-pager__jump-input"
              @keydown.enter.prevent="commitJump"
              @blur="commitJump"
            />
            <span class="q-pager__of">{{ strings.of(pages!) }}</span>
          </span>
          <span v-else aria-hidden="true">{{ strings.compact(current, pages!) }}</span>
        </span>

        <QButton
          :size="props.size"
          class="q-pager__next"
          icon-start="chevron-right"
          :aria-label="strings.next"
          :disabled="disabled || !hasNextPage"
          :href="href(current + 1, hasNextPage)"
          @click="nav(current + 1)"
        />
        <QButton
          v-if="firstLast"
          :size="props.size"
          class="q-pager__last"
          icon-start="chevrons-right"
          :aria-label="strings.last"
          :disabled="disabled || !hasNextPage"
          :href="href(pages!, hasNextPage)"
          @click="nav(pages!)"
        />
      </div>
    </div>
    <span class="q-visually-hidden" role="status">{{ announce }}</span>
  </nav>
</template>
