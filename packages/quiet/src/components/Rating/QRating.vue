<script setup lang="ts">
import { computed } from 'vue';
import { oneDecimal, useStrings } from '../../config';
import QStars from './QStars.vue';
import { ratingDefaults, type RatingStrings } from './stars';

export interface RatingProps {
  /** 0–5, fractions show as part-filled stars. */
  value: number;
  count?: number;
  /** Makes it a link (to the reviews). */
  href?: string;
  showValue?: boolean;
  size?: 'small' | 'default' | 'large';
  strings?: RatingStrings;
}

const props = withDefaults(defineProps<RatingProps>(), {
  count: undefined,
  href: undefined,
  showValue: true,
  size: 'default',
  strings: undefined,
});

const strings = useStrings<Required<RatingStrings>>('rating', ratingDefaults(), () => props.strings);
// Read as one phrase: "Rated 4.6 out of 5, 128 reviews".
const shown = computed(() => oneDecimal(props.value || 0));
const none = computed(() => !props.value && !props.count);
</script>

<template>
  <component
    :is="href != null ? 'a' : 'span'"
    :href="href"
    :class="['q-rating', size === 'small' && 'q-rating--small', size === 'large' && 'q-rating--large', href != null && 'q-rating--link']"
  >
    <QStars :value="value || 0" />
    <span v-if="none" class="q-rating__none">{{ strings.none }}</span>
    <template v-else>
      <span v-if="showValue" class="q-rating__value" aria-hidden="true">{{ shown }}</span>
      <span v-if="count != null" class="q-rating__count" aria-hidden="true">{{ strings.count(count) }}</span>
      <span class="q-visually-hidden">{{ strings.label(shown, count) }}</span>
    </template>
  </component>
</template>
