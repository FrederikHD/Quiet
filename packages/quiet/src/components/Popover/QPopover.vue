<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { useQuietId } from '../../composables/useQuietId';
import QPopoverPanel from '../../internal/QPopoverPanel.vue';
import { warnOnce } from '../../utils/dom';
import { lastFocusTrigger } from '../../utils/overlay';

export interface PopoverProps {
  /** Names the panel for screen readers: "Help: SKU", "Change order status". Required. */
  label: string;
  /** Short text to show (or use the `content` slot). */
  content?: string;
  /** tip = short read-only text (help, explanations): focus stays on the trigger and the text is announced. dialog (default) = interactive content: focus moves into the panel. menu = a list of actions (Menu uses it). */
  kind?: 'tip' | 'dialog' | 'menu';
  /** Preferred side; flips when there is no room. Default bottom. */
  placement?: 'bottom' | 'top';
  /** Which edge lines up with the trigger. Default start. */
  align?: 'start' | 'center' | 'end';
  /** Fixed panel width (px number or CSS length). Default: fits the content, up to 320px (280px for tips). */
  width?: number | string;
  /** Opens on first render (uncontrolled). */
  defaultOpen?: boolean;
  /** Dialog kind: the element focused when it opens. Default: the first control in the panel. */
  initialFocus?: HTMLElement | null;
  /** No padding inside the panel (lists that reach the edges). */
  flush?: boolean;
  /** Class for the floating panel. */
  panelClass?: unknown;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PopoverProps>(), {
  kind: 'dialog',
  placement: 'bottom',
  align: 'start',
  content: undefined,
  width: undefined,
  initialFocus: undefined,
  panelClass: undefined,
});
/** Open or not; use v-model:open to control it. */
const open = defineModel<boolean>('open', { default: false });
defineSlots<{
  /** The trigger: one element, usually a Button. It gets aria-expanded, aria-controls and the click that toggles the panel. */
  default(): unknown;
  /** What the panel shows. */
  content?(): unknown;
}>();

const panelId = useQuietId('q-popover-');
const wrap = ref<HTMLElement | null>(null);
const trigger = ref<HTMLElement | null>(null);

if (import.meta.env.DEV && !props.label) warnOnce('popover-label', 'Popover: pass a label — it names the panel for screen readers.');
if (props.defaultOpen && !open.value) open.value = true;

onMounted(() => {
  trigger.value = (wrap.value?.firstElementChild as HTMLElement | null) ?? null;
});
// The trigger tells assistive tech what it opens, and whether it is open.
watchEffect(() => {
  const t = trigger.value;
  if (!t) return;
  t.setAttribute('aria-expanded', String(open.value));
  if (open.value) t.setAttribute('aria-controls', panelId);
  else t.removeAttribute('aria-controls');
  if (props.kind === 'tip') t.removeAttribute('aria-haspopup');
  else t.setAttribute('aria-haspopup', props.kind === 'menu' ? 'menu' : 'dialog');
});

function onTriggerClick(e: MouseEvent) {
  if (!e.defaultPrevented) open.value = !open.value;
}
// A tip belongs to its trigger: it closes when focus moves on (Tab), unless it moves into the tip itself.
function onTriggerFocusOut(e: FocusEvent) {
  if (props.kind !== 'tip' || !open.value) return;
  const next = e.relatedTarget as Node | null;
  if (next && !document.getElementById(panelId)?.contains(next)) open.value = false;
}
function onClose(returnFocus: boolean) {
  open.value = false;
  if (returnFocus) trigger.value?.focus();
}
// Closed by the app (an action inside it) while focus was inside: focus would fall to the page, so put it back.
watch(open, (now, was) => {
  if (!was || now) return;
  setTimeout(() => {
    const a = document.activeElement;
    if ((!a || a === document.body) && lastFocusTrigger() === trigger.value && trigger.value?.isConnected) trigger.value.focus();
  }, 0);
});

const anchorEl = computed(() => trigger.value);
defineExpose({
  show: () => (open.value = true),
  hide: () => (open.value = false),
  toggle: () => (open.value = !open.value),
});
</script>

<template>
  <span ref="wrap" class="q-popover__trigger" style="display: contents" @click="onTriggerClick" @focusout="onTriggerFocusOut">
    <slot />
  </span>
  <QPopoverPanel
    :id="panelId"
    :open="open"
    :kind="kind"
    :label="label"
    :anchor="anchorEl"
    :trigger="trigger"
    :placement="placement"
    :align="align"
    :width="width"
    :flush="flush"
    :initial-focus="initialFocus"
    :panel-class="panelClass"
    @close="onClose"
  >
    <slot name="content">{{ content }}</slot>
  </QPopoverPanel>
</template>
