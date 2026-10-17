<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useSlots, watch } from 'vue';
import { useStrings } from '../../config';
import { useQuietId } from '../../composables/useQuietId';
import { FOCUSABLE, visibleFocusables, warnOnce } from '../../utils/dom';
import {
  hasLayers,
  inertAllBut,
  isTopLayer,
  lockPage,
  popLayer,
  pushLayer,
  releaseInert,
  rememberPlace,
  restoreFocus,
  returnTarget,
  unlockPage,
  type FocusPlace,
} from '../../utils/overlay';
import QButton from '../Button/QButton.vue';

export interface DialogProps {
  /** Names the dialog: a short phrase saying what it is for — "Delete product?", "Edit shipping address". Required (or use the `title` slot for rich content). */
  title: string;
  /** One or two sentences under the title, read out with it (or use the `description` slot). */
  description?: string;
  /** sm 400px (confirmations), md 560px (default: short forms, pickers), lg 760px (longer forms, tables). */
  size?: 'sm' | 'md' | 'lg';
  /** center (default), or start / end: a full-height drawer from the left or right on every screen (navigation, filters). */
  placement?: 'center' | 'start' | 'end';
  /** On screens under 640px: sheet (default) slides up from the bottom; inset floats as a card, top-aligned (pickers, search); full fills the screen. */
  mobile?: 'sheet' | 'inset' | 'full';
  /** dialog (default), or alertdialog for confirmations that interrupt — "Delete product?". */
  role?: 'dialog' | 'alertdialog';
  /** Default true. false: Escape and the backdrop don't close it, and there's no close button — only for a step that must be answered. */
  dismissible?: boolean;
  /** Text button instead of the × in the header, e.g. "Done". */
  closeText?: string;
  /** Name of the × button. Default "Close" — translate it ("Schließen"). */
  closeLabel?: string;
  /** Focused when it opens. Default: the first control in the body, else the first footer button (Cancel in a confirmation), else the dialog itself. */
  initialFocus?: HTMLElement | null;
  /** Body without padding, for content that scrolls on its own (a list). */
  flush?: boolean;
  /** Density inside the dialog. Default: the density around the element that opened it. */
  density?: 'comfortable' | 'compact';
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DialogProps>(), {
  size: 'md',
  placement: 'center',
  mobile: 'sheet',
  role: 'dialog',
  dismissible: true,
  description: undefined,
  closeText: undefined,
  closeLabel: undefined,
  initialFocus: undefined,
  density: undefined,
});
/** Shown or not. Escape, the backdrop and the × set it to false. */
const open = defineModel<boolean>('open', { default: false });
const emit = defineEmits<{
  /** Escape, a click on the backdrop, or the close button. */
  close: [];
}>();
defineSlots<{
  /** The content. */
  default?(): unknown;
  /** A rich title, in place of the title prop. */
  title?(): unknown;
  /** A rich description, in place of the description prop. */
  description?(): unknown;
  /** Buttons at the bottom, primary last. Stacked full width on phones. */
  footer?(): unknown;
}>();

const slots = useSlots();
const hasDesc = () => !!props.description || !!slots.description;
const strings = useStrings('dialog', { close: 'Close' });
const baseId = useQuietId('q-dialog-');
const titleId = `${baseId}-title`;
const descId = `${baseId}-desc`;
const layerId = `${baseId}-layer`;
const root = ref<HTMLElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const inheritedDensity = ref<string | undefined>();
let downOnScrim = false;
let place: FocusPlace | null = null;
let inerted: Element[] = [];
let active = false;

function close() {
  emit('close');
  open.value = false;
}

function onKeyDown(e: KeyboardEvent) {
  if (!isTopLayer(layerId) || !panel.value) return;
  if (e.key === 'Escape') {
    if (props.dismissible) {
      e.preventDefault();
      close();
    }
  } else if (e.key === 'Tab') {
    const items = visibleFocusables(panel.value);
    if (!items.length) {
      e.preventDefault();
      panel.value.focus();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const a = document.activeElement;
    if (e.shiftKey && (a === first || a === panel.value)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && a === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

function activate() {
  if (active) return;
  active = true;
  pushLayer(layerId);
  lockPage();
  // Everything else on the page becomes unreachable (keyboard, pointer, screen readers) while the dialog is open.
  inerted = inertAllBut(root.value);
  const p = panel.value;
  const inBody = FOCUSABLE.split(', ').map((s) => `.q-dialog__body ${s}`).join(', ');
  const inFooter = FOCUSABLE.split(', ').map((s) => `.q-dialog__footer ${s}`).join(', ');
  const target =
    props.initialFocus ??
    p?.querySelector<HTMLElement>(inBody) ??
    // Nothing to fill in (a confirmation): the first footer button — Cancel, the safe choice.
    p?.querySelector<HTMLElement>(inFooter) ??
    p;
  target?.focus({ preventScroll: true });
  document.addEventListener('keydown', onKeyDown);
}

function deactivate() {
  if (!active) return;
  active = false;
  document.removeEventListener('keydown', onKeyDown);
  popLayer(layerId);
  unlockPage();
  releaseInert(inerted);
  inerted = [];
  // Only the dialog on top hands focus back; one closing underneath another leaves focus alone.
  const a = document.activeElement;
  if (!hasLayers() || !a || a === document.body || !a.isConnected || panel.value?.contains(a)) restoreFocus(place);
}

watch(
  open,
  async (isOpen) => {
    if (!isOpen) {
      deactivate();
      return;
    }
    if (import.meta.env.DEV && !props.title && !slots.title) warnOnce('dialog-title', 'Dialog: pass a title — it names the dialog for screen readers.');
    place = rememberPlace(returnTarget());
    inheritedDensity.value = place?.el.closest('[data-density]')?.getAttribute('data-density') ?? undefined;
    await nextTick();
    // Once more when it opens on mount: a template ref to a control inside, passed as initial-focus, arrives a tick later.
    await nextTick();
    if (open.value) activate();
  },
  { immediate: true },
);
onBeforeUnmount(deactivate);

function onScrimDown(e: MouseEvent) {
  downOnScrim = e.target === e.currentTarget;
}
function onScrimClick(e: MouseEvent) {
  if (props.dismissible && downOnScrim && e.target === e.currentTarget) close();
  downOnScrim = false;
}

defineExpose({ panel, close });
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      ref="root"
      :class="['q-dialog', placement === 'center' ? `q-dialog--${mobile}` : `q-dialog--drawer q-dialog--${placement}`]"
      :data-density="density ?? inheritedDensity"
      @mousedown="onScrimDown"
      @click="onScrimClick"
    >
      <div
        ref="panel"
        v-bind="$attrs"
        :role="role"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="hasDesc() ? descId : undefined"
        tabindex="-1"
        :class="['q-dialog__panel', `q-dialog__panel--${size}`]"
      >
        <div class="q-dialog__header">
          <h2 :id="titleId" class="q-dialog__title"><slot name="title">{{ title }}</slot></h2>
          <QButton v-if="closeText" variant="ghost" @click="close">{{ closeText }}</QButton>
          <QButton v-else-if="dismissible" variant="ghost" icon-start="x" :aria-label="closeLabel || strings.close" @click="close" />
        </div>
        <p v-if="hasDesc()" :id="descId" class="q-dialog__desc"><slot name="description">{{ description }}</slot></p>
        <div :class="['q-dialog__body', flush && 'q-dialog__body--flush']"><slot /></div>
        <div v-if="slots.footer" class="q-dialog__footer"><slot name="footer" /></div>
      </div>
    </div>
  </Teleport>
</template>
