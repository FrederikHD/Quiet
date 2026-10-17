<script setup lang="ts">
// A field's message. The live region always exists (and is never display:none), so a message that appears later
// is announced. quiet: the Form's error summary is showing and already announces the errors.
import QIcon from '../components/Icon/QIcon.vue';
import type { FormStrings } from '../components/Field/context';

defineProps<{
  status: 'error' | 'warning' | 'success' | null;
  message?: string | null;
  id: string;
  strings: Required<FormStrings>;
  quiet?: boolean;
}>();

const ICONS = { error: 'alert-circle', warning: 'alert-triangle', success: 'check-circle' } as const;
const PREFIX = { error: 'errorPrefix', warning: 'warningPrefix', success: 'successPrefix' } as const;
</script>

<template>
  <div class="q-field__live" :aria-live="quiet ? 'off' : 'polite'">
    <div v-if="status" :id="id" :class="['q-field__msg', `q-field__msg--${status}`]">
      <span class="q-lead" aria-hidden="true"><QIcon :name="ICONS[status]" size="sm" /></span>
      <span>
        <span v-if="strings[PREFIX[status]]" class="q-visually-hidden">{{ `${strings[PREFIX[status]]} ` }}</span>
        <slot>{{ message }}</slot>
      </span>
    </div>
  </div>
</template>
