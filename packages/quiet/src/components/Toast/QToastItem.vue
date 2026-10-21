<script setup lang="ts">
// One toast. Never takes focus; pauses while hovered or focused, so people can read it and reach Undo.
import { inject, onBeforeUnmount, onMounted, ref } from 'vue';
import QLead from '../../internal/QLead.vue';
import QIcon from '../Icon/QIcon.vue';
import { dismissToast, toastHandBackKey, type ToastItem } from './store';

const props = defineProps<{ toast: ToastItem; dismissLabel: string }>();
const handBack = inject(toastHandBackKey, null);
const el = ref<HTMLElement | null>(null);

// Hover and focus are tracked apart: the mouse leaving must not restart the timer while focus is still inside.
let hovered = false;
let focused = false;
let paused = false;
let left = props.toast.duration;
let started = Date.now();
let timer = 0;
function run() {
  clearTimeout(timer);
  if (props.toast.duration > 0) {
    started = Date.now();
    timer = window.setTimeout(() => dismissToast(props.toast.id), left);
  }
}
function pause() {
  if (paused) return;
  paused = true;
  clearTimeout(timer);
  left = Math.max(1000, left - (Date.now() - started));
}
function resume() {
  if (!paused) return;
  paused = false;
  run();
}
function update() {
  if (hovered || focused) pause();
  else resume();
}
function onHover(on: boolean) {
  hovered = on;
  update();
}
function onFocusOut(e: FocusEvent) {
  focused = !!(e.relatedTarget && el.value?.contains(e.relatedTarget as Node));
  update();
}
function onFocusIn() {
  focused = true;
  update();
}
onMounted(run);
onBeforeUnmount(() => clearTimeout(timer));

// Pressed from the keyboard, focus would fall to the page as the toast goes: the Toaster puts it somewhere useful.
function dismiss() {
  if (el.value) handBack?.(el.value);
  dismissToast(props.toast.id);
}
function act() {
  props.toast.action?.onClick();
  dismiss();
}
</script>

<template>
  <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -- hover pauses the timer; focusin pauses it for keyboard users too -->
  <div
    ref="el"
    :class="['q-toast', `q-toast--${toast.tone}`]"
    @mouseenter="onHover(true)"
    @mouseleave="onHover(false)"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <QLead v-if="toast.tone !== 'neutral'" :icon="toast.tone === 'error' ? 'alert-circle' : 'check-circle'" />
    <span class="q-toast__msg">{{ toast.message }}</span>
    <button v-if="toast.action" type="button" class="q-toast__action" @click="act">{{ toast.action.label }}</button>
    <button type="button" class="q-toast__close" :aria-label="dismissLabel" @click="dismiss">
      <QIcon name="x" size="sm" />
    </button>
  </div>
</template>
