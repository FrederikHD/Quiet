<!-- dismissible adds a × that emits dismiss; remove the notice when it's pressed and move focus to what replaces it. -->
<script setup lang="ts">
import { QButton, QNotice } from '@frederikhd/quiet';
import { nextTick, ref } from 'vue';

const show = ref(true);
const root = ref<HTMLElement>();

// The × and the button disappear when pressed, so focus moves on instead of falling back to the page.
async function toggle(next: boolean) {
  show.value = next;
  await nextTick();
  root.value?.querySelector<HTMLElement>(next ? '.q-notice' : 'button')?.focus();
}
</script>

<template>
  <div ref="root">
    <QNotice v-if="show" title="New: edit prices in bulk" dismissible tabindex="-1" @dismiss="toggle(false)">
      Select products in the list, then choose Edit prices.
    </QNotice>
    <QButton v-else variant="ghost" @click="toggle(true)">Show the notice again</QButton>
  </div>
</template>
