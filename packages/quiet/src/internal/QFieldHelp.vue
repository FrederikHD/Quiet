<script setup lang="ts">
// The help icon after a label: opens a Popover tip with one or two sentences, on click, never on hover.
import { computed } from 'vue';
import QButton from '../components/Button/QButton.vue';
import QPopover from '../components/Popover/QPopover.vue';

const props = defineProps<{ help?: string; label?: string; prefix: string }>();
const name = computed(() => `${props.prefix}: ${props.label ?? ''}`);
</script>

<template>
  <span class="q-field__help">
    <QPopover kind="tip" :label="name" :content="help">
      <QButton variant="ghost" size="slim" icon-start="help" :aria-label="name" />
      <template v-if="$slots.default" #content><slot /></template>
    </QPopover>
  </span>
</template>
