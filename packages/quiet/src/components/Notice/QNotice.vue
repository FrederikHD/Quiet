<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { useConfig, useStrings } from '../../config';
import QButton from '../Button/QButton.vue';
import QIcon from '../Icon/QIcon.vue';
import type { IconName } from '../Icon/icons';

export type NoticeTone = 'info' | 'success' | 'warning' | 'danger';
export interface NoticeStrings {
  dismiss?: string;
  prefix?: Partial<Record<NoticeTone, string>>;
}

export interface NoticeProps {
  /** info (default) for neutral facts; success when something worked; warning for a problem to look at; danger for something that failed. Warning and danger are announced with a hidden "Warning:" / "Error:" prefix. */
  tone?: NoticeTone;
  /** One line in semibold above the text (or use the `title` slot). */
  title?: string;
  /** Adds a × that emits `dismiss`. */
  dismissible?: boolean;
  /** Replaces the tone's own icon. */
  icon?: IconName;
  /** "status" or "alert" when it appears in response to something; none (default) for a notice that is part of the page. */
  role?: 'status' | 'alert';
  /** Translations: { dismiss: 'Dismiss', prefix: { warning: 'Warning:', danger: 'Error:' } }. */
  strings?: NoticeStrings;
}

const props = withDefaults(defineProps<NoticeProps>(), {
  tone: 'info',
  title: undefined,
  icon: undefined,
  role: undefined,
  strings: undefined,
});
const emit = defineEmits<{
  /** The × was pressed. Remove the notice. */
  dismiss: [];
}>();
defineSlots<{
  /** The text. */
  default?(): unknown;
  /** A rich title, in place of the title prop. */
  title?(): unknown;
  /** Buttons or links under the text. */
  actions?(): unknown;
}>();

const slots = useSlots();
const ICONS: Record<NoticeTone, IconName> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  danger: 'alert-circle',
};
const PREFIX: Record<NoticeTone, string> = { info: '', success: '', warning: 'Warning:', danger: 'Error:' };
const strings = useStrings<NoticeStrings>('notice', { dismiss: 'Dismiss', prefix: PREFIX }, () => props.strings);
// The prefixes merge one by one, so { prefix: { warning: 'Achtung:' } } keeps the other tones' prefixes.
const config = useConfig();
const tone = computed<NoticeTone>(() => (props.tone in ICONS ? props.tone : 'info'));
const hasTitle = () => !!props.title || !!slots.title;
const prefix = computed(
  () =>
    ({
      ...PREFIX,
      ...(config.strings.notice as NoticeStrings | undefined)?.prefix,
      ...props.strings?.prefix,
    })[tone.value],
);
</script>

<template>
  <div :class="['q-notice', `q-notice--${tone}`]" :role="role">
    <span class="q-notice__icon" aria-hidden="true"><QIcon :name="icon ?? ICONS[tone]" /></span>
    <div class="q-notice__body">
      <p v-if="hasTitle()" class="q-notice__title">
        <span v-if="prefix" class="q-visually-hidden">{{ `${prefix} ` }}</span
        ><slot name="title">{{ title }}</slot>
      </p>
      <div v-if="slots.default" class="q-notice__text">
        <span v-if="!hasTitle() && prefix" class="q-visually-hidden">{{ `${prefix} ` }}</span
        ><slot />
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
