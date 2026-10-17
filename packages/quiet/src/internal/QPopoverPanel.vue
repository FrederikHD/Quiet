<script setup lang="ts">
// The floating panel behind Popover, Menu and Combobox: teleported to <body>, placed below (or above) its anchor,
// flipped when there is no room, kept inside the viewport, and closed by Escape (topmost layer only), a click
// outside, or focus moving away. Tab order behaves as if the panel sat right after its trigger.
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { FOCUSABLE, cssLength, visibleFocusables, warnOnce } from '../utils/dom';
import { isTopLayer, popLayer, pushLayer } from '../utils/overlay';

const props = defineProps<{
  open: boolean;
  id: string;
  /** What the panel is placed against (defaults to the trigger). */
  anchor?: HTMLElement | null;
  /** The element that opened it: gets focus back, and counts as "inside" for clicks and focus. */
  trigger?: HTMLElement | null;
  kind: 'tip' | 'dialog' | 'menu';
  label?: string;
  placement?: 'bottom' | 'top';
  align?: 'start' | 'center' | 'end';
  width?: number | string;
  /** As wide as the anchor (at least minWidth). */
  matchAnchorWidth?: boolean;
  minWidth?: number;
  /** Use the side with room and cap the height to it (lists that scroll). */
  fitHeight?: boolean;
  flush?: boolean;
  initialFocus?: HTMLElement | null;
  panelClass?: unknown;
  panelStyle?: unknown;
}>();

const emit = defineEmits<{ close: [returnFocus: boolean] }>();

const EDGE = 8; // keep this far from the viewport edge
const GAP = 8; // distance from the anchor

const panel = ref<HTMLElement | null>(null);
const place = ref<{ top: number; left: number; side: 'top' | 'bottom'; density?: string; width?: number; maxHeight?: number } | null>(
  null,
);
const announce = ref(false);
let placed = false;
let focused = false;
let started = false;

function close(returnFocus = false) {
  emit('close', returnFocus);
}

function reposition() {
  const t = props.anchor ?? props.trigger;
  const p = panel.value;
  if (!t || !p) return;
  const densityAt = t.closest('[data-density]');
  const tr = t.getBoundingClientRect();
  let pr: { width: number; height: number } = p.getBoundingClientRect();
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  // The trigger scrolled out of view: the panel has nothing to point at any more.
  if (placed && (tr.bottom < 0 || tr.top > vh || tr.right < 0 || tr.left > vw)) {
    close();
    return;
  }
  let want: 'top' | 'bottom' = props.placement === 'top' ? 'top' : 'bottom';
  const spaceBelow = vh - tr.bottom - GAP - EDGE;
  const spaceAbove = tr.top - GAP - EDGE;
  let maxHeight: number | undefined;
  if (props.fitHeight) {
    const natural = p.scrollHeight;
    if (want === 'bottom' && natural > spaceBelow && spaceAbove > spaceBelow) want = 'top';
    else if (want === 'top' && natural > spaceAbove && spaceBelow > spaceAbove) want = 'bottom';
    maxHeight = Math.max(120, Math.floor(want === 'bottom' ? spaceBelow : spaceAbove));
    pr = { width: pr.width, height: Math.min(natural, maxHeight) };
  }
  const below = tr.bottom + GAP;
  const above = tr.top - GAP - pr.height;
  let side = want;
  if (!props.fitHeight) {
    if (want === 'bottom' && below + pr.height > vh - EDGE && above >= EDGE) side = 'top';
    if (want === 'top' && above < EDGE && below + pr.height <= vh - EDGE) side = 'bottom';
  }
  const align = props.align ?? 'start';
  let left = align === 'end' ? tr.right - pr.width : align === 'center' ? tr.left + tr.width / 2 - pr.width / 2 : tr.left;
  left = Math.max(EDGE, Math.min(left, vw - pr.width - EDGE));
  const top = Math.max(EDGE, Math.min(side === 'top' ? above : below, vh - pr.height - EDGE));
  placed = true;
  const next = {
    top: Math.round(top),
    left: Math.round(left),
    side,
    density: densityAt?.getAttribute('data-density') ?? undefined,
    width: props.matchAnchorWidth ? Math.round(Math.max(tr.width, props.minWidth ?? 0)) : undefined,
    maxHeight,
  };
  const prev = place.value;
  if (
    !prev ||
    prev.top !== next.top ||
    prev.left !== next.left ||
    prev.side !== next.side ||
    prev.width !== next.width ||
    prev.density !== next.density ||
    prev.maxHeight !== next.maxHeight
  ) {
    place.value = next;
  }
}

let raf = 0;
const schedule = () => {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(reposition);
};
function contains(el: EventTarget | null) {
  const n = el as Node | null;
  if (!n) return false;
  return !!(panel.value?.contains(n) || props.trigger?.contains(n) || props.anchor?.contains(n));
}
function onPointerDown(e: PointerEvent) {
  if (!contains(e.target)) close();
}
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isTopLayer(props.id)) {
    e.stopPropagation();
    close(true);
  }
}

let ro: ResizeObserver | null = null;
let tipTimer = 0;
function start() {
  started = true;
  pushLayer(props.id);
  window.addEventListener('scroll', schedule, true);
  window.addEventListener('resize', schedule);
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('keydown', onKeyDown);
  if (typeof ResizeObserver !== 'undefined' && panel.value) {
    ro = new ResizeObserver(schedule);
    ro.observe(panel.value);
  }
  if (props.kind === 'tip') {
    if (import.meta.env.DEV && panel.value?.querySelector(FOCUSABLE)) {
      warnOnce('tip-interactive', 'Popover: a kind="tip" panel holds a link or control, which keyboard and screen-reader users can\'t reach. Use kind="dialog".');
    }
    // Fill the live region a moment after it exists, so screen readers announce the text.
    tipTimer = window.setTimeout(() => (announce.value = true), 60);
  }
}
function stop() {
  if (!started) return;
  started = false;
  cancelAnimationFrame(raf);
  clearTimeout(tipTimer);
  window.removeEventListener('scroll', schedule, true);
  window.removeEventListener('resize', schedule);
  document.removeEventListener('pointerdown', onPointerDown, true);
  document.removeEventListener('keydown', onKeyDown);
  popLayer(props.id);
  ro?.disconnect();
  ro = null;
}

watch(
  () => props.open,
  async (open) => {
    if (!open) {
      stop();
      placed = false;
      focused = false;
      place.value = null;
      announce.value = false;
      return;
    }
    await nextTick();
    // Closed again before it was placed: nothing to set up.
    if (!props.open || started) return;
    reposition();
    start();
  },
  { immediate: true },
);
onBeforeUnmount(stop);

// Dialog and menu kinds: move focus in once the panel is placed and visible (hidden elements can't take focus).
watch(place, async (p) => {
  if (!p || focused || props.kind === 'tip' || !panel.value) return;
  focused = true;
  await nextTick();
  const first = props.initialFocus ?? panel.value?.querySelector<HTMLElement>(FOCUSABLE);
  (first ?? panel.value)?.focus({ preventScroll: true });
});

// The panel lives at the end of the page, so keep Tab order as if it sat right after its trigger.
function onPanelKeyDown(e: KeyboardEvent) {
  if (props.kind === 'tip' || e.key !== 'Tab') return;
  const p = panel.value;
  const t = props.trigger;
  if (!p || !t) return;
  const items = visibleFocusables(p);
  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement;
  const leave = props.kind === 'menu'; // a menu is one Tab stop: Tab leaves it
  if (e.shiftKey && (leave || active === first || active === p)) {
    e.preventDefault();
    close(true);
  } else if (!e.shiftKey && (leave || active === last || items.length === 0)) {
    e.preventDefault();
    const all = Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => !p.contains(el) && el.offsetParent !== null && !el.closest('[inert]'),
    );
    const after = all.find((el) => t.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING && !t.contains(el));
    close();
    (after ?? t).focus();
  }
}

function onPanelFocusOut(e: FocusEvent) {
  if (props.kind === 'tip') return;
  const next = e.relatedTarget;
  if (next && !contains(next)) close(); // focus moved elsewhere on the page
}

const style = computed(() => {
  const p = place.value;
  const s: Record<string, string | undefined> = p ? { top: `${p.top}px`, left: `${p.left}px` } : { top: '0px', left: '0px', visibility: 'hidden' };
  if (p?.width) {
    s.width = `${p.width}px`;
    s.maxWidth = 'calc(100vw - 16px)';
  } else if (props.width != null) s.width = cssLength(props.width);
  if (p?.maxHeight) {
    s.maxHeight = `${p.maxHeight}px`;
    s['--q-pop-max'] = `${p.maxHeight}px`;
  }
  return [props.panelStyle, s];
});

defineExpose({ panel, reposition });
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      :id="id"
      ref="panel"
      :class="['q-popover', kind === 'tip' && 'q-popover--tip', flush && 'q-popover--flush', panelClass]"
      :role="kind === 'dialog' ? 'dialog' : undefined"
      :aria-label="kind === 'dialog' ? label : undefined"
      :data-side="place?.side"
      :data-density="place?.density"
      tabindex="-1"
      :style="style as any"
      @focusout="onPanelFocusOut"
      @keydown="onPanelKeyDown"
    >
      <template v-if="kind === 'tip'">
        <!-- What sighted people see, immediately. -->
        <div aria-hidden="true"><slot /></div>
        <!-- A visually hidden live region filled a moment later, so screen readers announce it. -->
        <div role="status" class="q-visually-hidden"><slot v-if="announce" /></div>
      </template>
      <slot v-else />
    </div>
  </Teleport>
</template>
