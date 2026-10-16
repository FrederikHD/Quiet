<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { useStrings } from '../../config';
import QButton from '../Button/QButton.vue';
import QIcon from '../Icon/QIcon.vue';
import type { IconName } from '../Icon/icons';

export type NoticeTone = 'info' | 'success' | 'warning' | 'danger';
export interface NoticeStrings {
  dismiss?: string;
  prefix?: Partial<Record<NoticeTone, string>>;
}

export interface NoticeProps {
  tone?: NoticeTone;
  title?: string;
  /** Adds a × that emits `dismiss`. */
  dismissible?: boolean;
  icon?: IconName;
  /** "status" or "alert" when it appears in response to something; none for a notice that is part of the page. */
  role?: 'status' | 'alert';
  strings?: NoticeStrings;
}

const props = withDefaults(defineProps<NoticeProps>(), {
  tone: 'info',
  title: undefined,
  icon: undefined,
  role: undefined,
  strings: undefined,
});
const emit = defineEmits<{ dismiss: [] }>();
defineSlots<{
  /** The text. */
  default?(): unknown;
  /** Buttons or links under the text. */
  actions?(): unknown;
}>();

const slots = useSlots();
const ICONS: Record<NoticeTone, IconName> = { info: 'info', success: 'check-circle', warning: 'alert-triangle', danger: 'alert-circle' };
const strings = useStrings<NoticeStrings>(
  'notice',
  { dismiss: 'Dismiss', prefix: { info: '', success: '', warning: 'Warning:', danger: 'Error:' } },
  () => props.strings,
);
const tone = computed<NoticeTone>(() => (props.tone in ICONS ? props.tone : 'info'));
const prefix = computed(() => strings.value.prefix?.[tone.value]);
</script>

<template>
  <div :class="['q-notice', `q-notice--${tone}`]" :role="role">
    <span class="q-notice__icon" aria-hidden="true"><QIcon :name="icon ?? ICONS[tone]" /></span>
    <div class="q-notice__body">
      <p v-if="title" class="q-notice__title">
        <span v-if="prefix" class="q-visually-hidden">{{ prefix }} </span>{{ title }}
      </p>
      <div v-if="slots.default" class="q-notice__text">
        <span v-if="!title && prefix" class="q-visually-hidden">{{ prefix }} </span><slot />
      </div>
      <div v-if="slots.actions" class="q-notice__actions"><slot name="actions" /></div>
    </div>
    <QButton
      v-if="dismissible"
      variant="ghost"
      size="slim"
      class="q-notice__dismiss"
      icon-start="x"
      :aria-label="strings.dismiss"
      @click="emit('dismiss')"
    />
  </div>
</template>
