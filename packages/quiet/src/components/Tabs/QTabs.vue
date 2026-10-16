<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue';
import { fmt, useStrings } from '../../config';
import { useQuietId } from '../../composables/useQuietId';
import QIcon from '../Icon/QIcon.vue';
import type { IconName } from '../Icon/icons';

export interface TabItem {
  /** Identifies the tab; what v-model holds. Its panel is the `panel-<value>` slot. */
  value: string;
  label: string;
  /** An icon before the label. Use on every tab or none. */
  icon?: IconName;
  /** A number in a pill after the label: "Unfulfilled 8". Formatted for the locale. */
  count?: number | string;
  /** What the count means, for screen readers: "8 to fulfil". */
  countLabel?: string;
  /** Makes the row a navigation between pages instead: links with aria-current, no panels. */
  href?: string;
  disabled?: boolean;
}
export interface TabsProps {
  /** Names the tab row for screen readers: "Order", "Settings sections". */
  label: string;
  tabs: (TabItem | null | false)[];
  /** First value when you don't use v-model. */
  defaultValue?: string;
  /** line (default): tabs on a rule, for sections of a page. segmented: a pill track, for switching a view (7 days | 30 days). */
  variant?: 'line' | 'segmented';
  /** Tabs share the full width equally. */
  fill?: boolean;
  /** 28px on desktop, like other slim controls; density height on phones. */
  size?: 'default' | 'slim';
  /** auto (default): arrow keys choose as they move. manual: arrows move focus, Enter or Space chooses — for panels that are slow to show. */
  activation?: 'auto' | 'manual';
  /** Default true: the panel is a Tab stop, so it can be scrolled and read. Set false when the panel starts with a focusable control. */
  panelFocusable?: boolean;
  strings?: { hasErrors?: string };
}

const props = withDefaults(defineProps<TabsProps>(), {
  defaultValue: undefined,
  variant: 'line',
  size: 'default',
  activation: 'auto',
  panelFocusable: true,
  strings: undefined,
});
/** The chosen tab's value. With link tabs, null means this page is none of the sections. */
const model = defineModel<string | null>();
const emit = defineEmits<{ /** A link tab was clicked (for client-side routing). */ navigate: [tab: TabItem, event: MouseEvent] }>();
defineSlots<{
  /** One shared panel (saved filters over one table), or content under a row of link tabs. */
  default?(): unknown;
  /** The panel of each tab: #panel-details, #panel-timeline … */
  [name: `panel-${string}`]: (() => unknown) | undefined;
}>();

const slots = useSlots();
const strings = useStrings('tabs', { hasErrors: 'has errors' }, () => props.strings);
const baseId = useQuietId('q-tabs-');
const root = ref<HTMLElement | null>(null);
const list = ref<HTMLElement | null>(null);

const items = computed(() => props.tabs.filter((t): t is TabItem => !!t));
const enabled = computed(() => items.value.filter((t) => !t.disabled));
const links = computed(() => items.value.some((t) => t.href != null));
const shared = computed(() => !links.value && !items.value.some((t) => !!slots[`panel-${t.value}`]));
if (model.value === undefined) model.value = props.defaultValue ?? enabled.value[0]?.value;

// A value that isn't there (or is disabled) falls back to the first usable tab — except for links, where null means
// "this page isn't one of these sections".
const value = computed(() => {
  if (links.value && model.value === null) return null;
  return enabled.value.some((t) => t.value === model.value) ? model.value : (enabled.value[0]?.value ?? null);
});
const current = computed(() => items.value.find((t) => t.value === value.value));
function select(v: string) {
  if (v !== value.value) model.value = v;
}

const safe = (v: string) => String(v).replace(/[^\w-]/g, '_');
const tabId = (t: TabItem) => `${baseId}-tab-${safe(t.value)}`;
const panelId = (t?: TabItem) => (shared.value || !t ? `${baseId}-panel` : `${baseId}-panel-${safe(t.value)}`);

// Which panels hold an invalid field — watched, so the marker follows the form as people fix things.
const errs = ref<Record<string, boolean>>({});
let mo: MutationObserver | null = null;
function checkErrors() {
  const next: Record<string, boolean> = {};
  root.value?.querySelectorAll(':scope > .q-tabs__panel').forEach((p) => {
    next[p.getAttribute('data-q-tab') ?? ''] = !!p.querySelector('[aria-invalid="true"]');
  });
  if (Object.keys(next).some((k) => !!errs.value[k] !== next[k])) errs.value = next;
}
// Something inside a hidden panel asked to be shown (Form's error summary): open its tab.
function onReveal(e: Event) {
  const p = (e.target as Element).closest?.('.q-tabs__panel');
  if (p && p.parentElement === root.value && (p as HTMLElement).hidden) select(p.getAttribute('data-q-tab') ?? '');
}
// Long rows scroll sideways (phones): fade the edges that hide more tabs.
const edges = ref('');
function measure() {
  const el = list.value;
  if (!el) return;
  const max = el.scrollWidth - el.clientWidth;
  edges.value = max <= 1 ? '' : `${el.scrollLeft > 1 ? ' is-start' : ''}${el.scrollLeft < max - 1 ? ' is-end' : ''}`;
}
let ro: ResizeObserver | null = null;
onMounted(() => {
  if (!shared.value && !links.value && typeof MutationObserver !== 'undefined' && root.value) {
    checkErrors();
    mo = new MutationObserver(checkErrors);
    mo.observe(root.value, { subtree: true, attributes: true, attributeFilter: ['aria-invalid'], childList: true });
  }
  root.value?.addEventListener('q-reveal', onReveal);
  measure();
  list.value?.addEventListener('scroll', measure, { passive: true });
  if (typeof ResizeObserver !== 'undefined' && list.value) {
    ro = new ResizeObserver(measure);
    ro.observe(list.value);
  }
});
onBeforeUnmount(() => {
  mo?.disconnect();
  ro?.disconnect();
  root.value?.removeEventListener('q-reveal', onReveal);
  list.value?.removeEventListener('scroll', measure);
});

// Keep the chosen tab in view; when errors appear, show the first tab that has them instead.
const errKey = computed(() => Object.keys(errs.value).filter((k) => errs.value[k]).join('|'));
watch(
  [value, errKey],
  () => {
    const el = list.value;
    const tab = (errKey.value && el?.querySelector<HTMLElement>('.q-tabs__tab.is-invalid')) || el?.querySelector<HTMLElement>('[data-active="true"]');
    if (!el || !tab) return;
    const l = tab.offsetLeft;
    const r = l + tab.offsetWidth;
    const pad = 24;
    if (l - pad < el.scrollLeft) el.scrollLeft = Math.max(0, l - pad);
    else if (r + pad > el.scrollLeft + el.clientWidth) el.scrollLeft = r + pad - el.clientWidth;
  },
  { flush: 'post' },
);

// Arrow keys move along the tabs; Tab goes into the panel. Links are ordinary Tab stops.
function onKeyDown(e: KeyboardEvent) {
  if (links.value || !list.value) return;
  const tabs = Array.from(list.value.querySelectorAll<HTMLElement>('.q-tabs__tab:not([disabled])'));
  const i = tabs.indexOf(document.activeElement as HTMLElement);
  if (i === -1) return;
  const next =
    e.key === 'ArrowRight' ? tabs[(i + 1) % tabs.length]
    : e.key === 'ArrowLeft' ? tabs[(i - 1 + tabs.length) % tabs.length]
    : e.key === 'Home' ? tabs[0]
    : e.key === 'End' ? tabs[tabs.length - 1]
    : null;
  if (next) {
    e.preventDefault();
    next.focus();
    if (props.activation !== 'manual') select(next.dataset.value ?? '');
  }
}
const countText = (c: number | string) => (typeof c === 'number' ? fmt(c) : c);
</script>

<template>
  <div
    ref="root"
    :class="['q-tabs', `q-tabs--${variant}`, fill && 'q-tabs--fill', size === 'slim' && 'q-tabs--slim']"
  >
    <component :is="links ? 'nav' : 'div'" :class="`q-tabs__bar${edges}`" :aria-label="links ? label : undefined">
      <component
        :is="links ? 'ul' : 'div'"
        ref="list"
        class="q-tabs__list"
        :role="links ? undefined : 'tablist'"
        :aria-label="links ? undefined : label"
        @keydown="onKeyDown"
      >
        <template v-for="t in items" :key="t.value">
          <li v-if="links" class="q-tabs__item">
            <a
              :class="['q-tabs__tab', t.value === value && 'is-active']"
              :href="t.href"
              :aria-current="t.value === value ? 'page' : undefined"
              :data-active="t.value === value ? 'true' : undefined"
              @click="emit('navigate', t, $event)"
            >
              <span v-if="t.icon" class="q-tabs__icon" aria-hidden="true"><QIcon :name="t.icon" /></span>
              <span class="q-tabs__label">{{ t.label }}</span>
              <span v-if="t.count != null" class="q-tabs__count" :aria-hidden="t.countLabel ? 'true' : undefined">{{ countText(t.count) }}</span>
              <span v-if="t.count != null && t.countLabel" class="q-visually-hidden">, {{ t.countLabel }}</span>
            </a>
          </li>
          <button
            v-else
            :id="tabId(t)"
            type="button"
            role="tab"
            :class="['q-tabs__tab', t.value === value && 'is-active', errs[t.value] && 'is-invalid']"
            :aria-selected="t.value === value"
            :aria-controls="panelId(t)"
            :tabindex="t.value === value ? 0 : -1"
            :disabled="t.disabled || undefined"
            :data-value="t.value"
            :data-active="t.value === value ? 'true' : undefined"
            @click="select(t.value)"
          >
            <span v-if="t.icon" class="q-tabs__icon" aria-hidden="true"><QIcon :name="t.icon" /></span>
            <span class="q-tabs__label">{{ t.label }}</span>
            <span v-if="t.count != null" class="q-tabs__count" :aria-hidden="t.countLabel ? 'true' : undefined">{{ countText(t.count) }}</span>
            <span v-if="t.count != null && t.countLabel" class="q-visually-hidden">, {{ t.countLabel }}</span>
            <template v-if="errs[t.value]">
              <span class="q-tabs__error" aria-hidden="true" />
              <span class="q-visually-hidden">, {{ strings.hasErrors }}</span>
            </template>
          </button>
        </template>
      </component>
    </component>

    <div v-if="links && slots.default" class="q-tabs__panel q-tabs__panel--plain"><slot /></div>
    <div
      v-else-if="shared"
      :id="panelId(current)"
      class="q-tabs__panel"
      role="tabpanel"
      :aria-labelledby="current ? tabId(current) : undefined"
      :tabindex="panelFocusable ? 0 : undefined"
      :data-q-tab="current?.value ?? ''"
    >
      <slot />
    </div>
    <!-- Panels stay mounted (hidden), so form fields keep their values. -->
    <template v-else-if="!links">
      <div
        v-for="t in items"
        :id="panelId(t)"
        :key="t.value"
        class="q-tabs__panel"
        role="tabpanel"
        :aria-labelledby="tabId(t)"
        :tabindex="panelFocusable ? 0 : undefined"
        :hidden="t.value !== value"
        :data-q-tab="t.value"
      >
        <slot :name="`panel-${t.value}`" />
      </div>
    </template>
  </div>
</template>
