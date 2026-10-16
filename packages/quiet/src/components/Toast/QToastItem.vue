<script setup lang="ts">
// One toast. Never takes focus; pauses while hovered or focused, so people can read it and reach Undo.
import { onBeforeUnmount, onMounted } from 'vue';
import QLead from '../../internal/QLead.vue';
import QIcon from '../Icon/QIcon.vue';
import { dismissToast, type ToastItem } from './store';

const props = defineProps<{ toast: ToastItem; dismissLabel: string }>();

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
onMounted(run);
onBeforeUnmount(() => clearTimeout(timer));

function act() {
  props.toast.action?.onClick();
  dismissToast(props.toast.id);
}
</script>

<template>
  <div :class="['q-toast', `q-toast--${toast.tone}`]" @mouseenter="pause" @mouseleave="resume" @focusin="pause" @focusout="resume">
    <QLead v-if="toast.tone !== 'neutral'" :icon="toast.tone === 'error' ? 'alert-circle' : 'check-circle'" />
    <span class="q-toast__msg">{{ toast.message }}</span>
    <button v-if="toast.action" type="button" class="q-toast__action" @click="act">{{ toast.action.label }}</button>
    <button type="button" class="q-toast__close" :aria-label="dismissLabel" @click="dismissToast(toast.id)">
      <QIcon name="x" size="sm" />
    </button>
  </div>
</template>
