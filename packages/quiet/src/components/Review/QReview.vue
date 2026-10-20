<script setup lang="ts">
import { computed, ref, useSlots } from 'vue';
import { useConfig, useStrings } from '../../config';
import { useQuietId } from '../../composables/useQuietId';
import { useResizeObserver } from '../../composables/useResizeObserver';
import QButton from '../Button/QButton.vue';
import QIcon from '../Icon/QIcon.vue';
import QStars from '../Rating/QStars.vue';

export interface ReviewStrings {
  rated?: (stars: number) => string;
  by?: (author: string) => string;
  verified?: string;
  readMore?: string;
  readLess?: string;
  helpful?: (count: number) => string;
  reply?: string;
}
export interface ReviewProps {
  /** The stars given, 1–5. */
  rating: number;
  /** Who wrote it, as the shop shows names: "Anna S.". */
  author: string;
  /** A short headline: "Soft from the first wash". Without one, the review is named "Review by Anna S.". */
  title?: string;
  /** When it was written: a Date (shown in the configured locale, "12 October 2026") or your own text. */
  date?: Date | string;
  /** Bought from the shop: shows "Verified purchase". */
  verified?: boolean;
  /** What they bought, in short: ['Size M', 'Navy']. Shown under the name. */
  details?: string[];
  /** Folds the text after this many lines, with "Read more". Default 5; 0 never folds. */
  lines?: number;
  /** How many found it helpful: shows a "Helpful (3)" toggle button. Leave out for none. */
  helpful?: number;
  /** This visitor marked it helpful: the button is pressed. */
  voted?: boolean;
  /** The title's level. Default 3: under the reviews section's h2. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Translations; or once for the shop with configure(). */
  strings?: ReviewStrings;
}

const props = withDefaults(defineProps<ReviewProps>(), {
  title: undefined,
  date: undefined,
  details: undefined,
  lines: 5,
  helpful: undefined,
  headingLevel: 3,
  strings: undefined,
});
const emit = defineEmits<{
  /** The Helpful button was pressed: true to add the vote, false to take it back. */
  vote: [voted: boolean];
}>();
defineSlots<{
  /** The review's text. */
  default?(): unknown;
  /** The shop's reply, shown under the text in its own block. */
  reply?(): unknown;
}>();
const slots = useSlots();

const config = useConfig();
const strings = useStrings<Required<ReviewStrings>>(
  'review',
  {
    rated: (n) => `Rated ${n} out of 5`,
    by: (author) => `Review by ${author}`,
    verified: 'Verified purchase',
    readMore: 'Read more',
    readLess: 'Show less',
    helpful: (n) => `Helpful (${n})`,
    reply: 'Reply from the shop',
  },
  () => props.strings,
);

const titleId = useQuietId('q-review-title-');
const textId = useQuietId('q-review-text-');
const dateText = computed(() => {
  const d = props.date;
  if (d == null || typeof d === 'string') return d;
  return new Intl.DateTimeFormat(config.locale, { dateStyle: 'long' }).format(d);
});
const datetime = computed(() => (props.date instanceof Date ? props.date.toISOString().slice(0, 10) : undefined));

// Long text folds to `lines` lines; "Read more" shows only when there is more to read.
const text = ref<HTMLElement | null>(null);
const open = ref(false);
const overflows = ref(false);
useResizeObserver(text, () => {
  const el = text.value;
  if (el && !open.value) overflows.value = el.scrollHeight > el.clientHeight + 1;
});
</script>

<template>
  <article
    class="q-review"
    :aria-labelledby="title ? titleId : undefined"
    :aria-label="title ? undefined : strings.by(author)"
  >
    <div class="q-review__rating">
      <QStars :value="rating" />
      <span class="q-visually-hidden">{{ strings.rated(rating) }}</span>
    </div>
    <component :is="`h${headingLevel}`" v-if="title" :id="titleId" class="q-review__title">{{ title }}</component>
    <p class="q-review__meta">
      <span class="q-review__author">{{ author }}</span>
      <time v-if="dateText" :datetime="datetime">{{ dateText }}</time>
      <span v-if="verified" class="q-review__verified"
        ><QIcon name="check-circle" size="sm" />{{ strings.verified }}</span
      >
    </p>
    <p v-if="details?.length" class="q-review__details">{{ details.join(' · ') }}</p>
    <div
      v-if="slots.default"
      :id="textId"
      ref="text"
      :class="['q-review__text', lines > 0 && !open && 'is-folded']"
      :style="{ '--q-review-lines': lines || undefined }"
    >
      <slot />
    </div>
    <button
      v-if="slots.default && lines > 0 && (overflows || open)"
      type="button"
      class="q-review__more"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-controls="textId"
      @click="open = !open"
    >
      {{ open ? strings.readLess : strings.readMore }}
    </button>
    <div v-if="slots.reply" class="q-review__reply">
      <p class="q-review__reply-title">{{ strings.reply }}</p>
      <slot name="reply" />
    </div>
    <div v-if="helpful != null" class="q-review__foot">
      <QButton size="slim" variant="ghost" :pressed="!!voted" @click="emit('vote', !voted)">{{
        strings.helpful(helpful)
      }}</QButton>
    </div>
  </article>
</template>
