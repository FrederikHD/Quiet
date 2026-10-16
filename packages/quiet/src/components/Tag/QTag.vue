<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue';
import { useStrings } from '../../config';
import QLead from '../../internal/QLead.vue';
import { textOf } from '../../utils/dom';
import QIcon from '../Icon/QIcon.vue';
import type { IconName } from '../Icon/icons';

export interface TagStrings {
  remove?: (label: string) => string;
}

export interface TagProps {
  /** Makes it removable (emits `remove`). Pill: the whole tag is the button. Field: a small × of its own. */
  removable?: boolean;
  /** Names the remove button; default "Remove <text>". */
  removeLabel?: string;
  /** pill (default): filters in use, applied codes. field: a chosen option inside a multi-select field. */
  variant?: 'pill' | 'field';
  /** A colour dot before the text. */
  swatch?: string;
  icon?: IconName;
  /** After the text in ink-muted: "−10 %". */
  detail?: string;
  disabled?: boolean;
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
defineSlots<{ default(): unknown }>();

const slots = useSlots();
const attrs = useAttrs();
const strings = useStrings<Required<TagStrings>>('tag', { remove: (l) => `Remove ${l}` }, () => props.strings);
const isField = computed(() => props.variant === 'field');
const label = () => props.removeLabel ?? strings.value.remove(textOf(slots.default?.()));
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
    <span v-if="detail != null" class="q-tag__detail">{{ detail }}</span>
    <QIcon name="x" size="sm" class="q-tag__x" />
  </button>
  <span v-else v-bind="attrs" :class="classes">
    <span v-if="swatch" class="q-tag__dot" :style="{ '--q-swatch': swatch }" aria-hidden="true" />
    <QLead v-if="icon" :icon="icon" />
    <span class="q-tag__label"><slot /></span>
    <span v-if="detail != null" class="q-tag__detail">{{ detail }}</span>
    <button v-if="removable && !disabled" type="button" class="q-tag__remove" :aria-label="label()" @click="emit('remove')">
      <QIcon name="x" />
    </button>
  </span>
</template>
