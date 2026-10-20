<script setup lang="ts">
import { computed } from 'vue';
import { oneDecimal, useStrings } from '../../config';
import QStars from './QStars.vue';
import { ratingDefaults, type RatingStrings } from './stars';

export interface RatingProps {
  /** 0–5, fractions show as part-filled stars. */
  value: number;
  /** Number of reviews, shown as "(128)". Leave out to show only the stars and the value. */
  count?: number;
  /** Makes it a link (to the reviews). */
  href?: string;
  /** @click makes it a link too (href "#", not followed unless href is given), e.g. to open the reviews tab. */
  onClick?: (event: MouseEvent) => void;
  /** Show the number ("4.6", one decimal) after the stars. Default true. */
  showValue?: boolean;
  /** small (13px stars) in product cards and table rows, default (16px), large (20px) on the product page. */
  size?: 'small' | 'default' | 'large';
  /** Translations; or once for the shop with configure() under strings.rating. */
  strings?: RatingStrings;
}

const props = withDefaults(defineProps<RatingProps>(), {
  count: undefined,
  href: undefined,
  onClick: undefined,
  showValue: true,
  size: 'default',
  strings: undefined,
});

const strings = useStrings<Required<RatingStrings>>('rating', ratingDefaults(), () => props.strings);
// Read as one phrase: "Rated 4.6 out of 5, 128 reviews".
const shown = computed(() => oneDecimal(props.value || 0));
const none = computed(() => !props.value && !props.count);
const isLink = computed(() => props.href != null || !!props.onClick);
// Without an href the link is "#": following it would only jump to the top of the page.
function onLinkClick(e: MouseEvent) {
  if (props.href == null) e.preventDefault();
  props.onClick?.(e);
}
</script>

<template>
  <component
    :is="isLink ? 'a' : 'span'"
    :href="isLink ? (href ?? '#') : undefined"
    :class="[
      'q-rating',
      size === 'small' && 'q-rating--small',
      size === 'large' && 'q-rating--large',
      isLink && 'q-rating--link',
    ]"
    @click="isLink && onLinkClick($event)"
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
