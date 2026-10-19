<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue';
import { useStrings } from '../../config';
import QLead from '../../internal/QLead.vue';
import { textOf, warnOnce } from '../../utils/dom';
import QIcon from '../Icon/QIcon.vue';
import type { IconName } from '../Icon/icons';

export interface TagStrings {
  remove?: (label: string) => string;
}

export interface TagProps {
  /** Makes it removable (emits `remove`). Pill: the whole tag is the button. Field: a small × of its own. */
  removable?: boolean;
  /** Names the remove button; default "Remove <text>". On a pill it should contain the visible text. */
  removeLabel?: string;
  /** pill (default): filters in use, applied codes. field: a chosen option inside a multi-select field. */
  variant?: 'pill' | 'field';
  /** A colour dot before the text. */
  swatch?: string;
  /** A 16px icon before the text, in the brand colour (a tag icon for discount codes). */
  icon?: IconName;
  /** After the text in ink-muted: "−10 %" (or use the `detail` slot). */
  detail?: string;
  /** Can't be removed: a dimmed pill, or a field tag without its ×. */
  disabled?: boolean;
  /** Translations: { remove: (label) => string }, default "Remove <label>". */
  strings?: TagStrings;
}

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TagProps>(), {
  variant: 'pill',
  removeLabel: undefined,
  swatch: undefined,
  icon: undefined,
  detail: undefined,
  strings: undefined,
});
const emit = defineEmits<{ /** The tag (or its ×) was pressed. */ remove: [] }>();
defineSlots<{
  /** The text. */
  default(): unknown;
  /** Rich content after the text, in place of the detail prop. */
  detail?(): unknown;
}>();

const slots = useSlots();
const attrs = useAttrs();
const strings = useStrings<Required<TagStrings>>('tag', { remove: (l) => `Remove ${l}` }, () => props.strings);
const isField = computed(() => props.variant === 'field');
const hasDetail = () => props.detail != null || !!slots.detail;
const detailText = () => (slots.detail ? textOf(slots.detail()) : (props.detail ?? '')).trim();

// The remove button's name. A pill is all button, so its name must hold everything it shows (WCAG 2.5.3,
// label in name): "Remove discount LINEN10 −10 %", not just "Remove discount LINEN10".
function label() {
  const text = textOf(slots.default?.()).trim();
  const name = props.removeLabel || strings.value.remove(text);
  if (isField.value) return name;
  if (import.meta.env.DEV && text && !name.toLowerCase().includes(text.toLowerCase()))
    warnOnce('tag-label', `Tag: removeLabel "${name}" should contain the visible text "${text}".`);
  const detail = detailText();
  return detail && !name.includes(detail) ? `${name} ${detail}` : name;
}
const classes = computed(() => [
  'q-tag',
  isField.value && 'q-tag--field',
  props.removable && 'q-tag--removable',
  props.disabled && 'is-disabled',
]);
</script>

<template>
  <button
    v-if="removable && !isField"
    v-bind="attrs"
    type="button"
    :class="classes"
    :aria-label="label()"
    :disabled="disabled"
    @click="emit('remove')"
  >
    <span v-if="swatch" class="q-tag__dot" :style="{ '--q-swatch': swatch }" aria-hidden="true" />
    <QLead v-if="icon" :icon="icon" />
    <span class="q-tag__label"><slot /></span>
    <span v-if="hasDetail()" class="q-tag__detail"
      ><slot name="detail">{{ detail }}</slot></span
    >
    <QIcon name="x" size="sm" class="q-tag__x" />
  </button>
  <span v-else v-bind="attrs" :class="classes">
    <span v-if="swatch" class="q-tag__dot" :style="{ '--q-swatch': swatch }" aria-hidden="true" />
    <QLead v-if="icon" :icon="icon" />
    <span class="q-tag__label"><slot /></span>
    <span v-if="hasDetail()" class="q-tag__detail"
      ><slot name="detail">{{ detail }}</slot></span
    >
    <button
      v-if="removable && !disabled"
      type="button"
      class="q-tag__remove"
      :aria-label="label()"
      @click="emit('remove')"
    >
      <QIcon name="x" />
    </button>
  </span>
</template>
