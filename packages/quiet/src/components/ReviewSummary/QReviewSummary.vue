<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { fmt, oneDecimal, useStrings } from '../../config';
import QStars from '../Rating/QStars.vue';
import { STAR_PATH, ratingDefaults, type RatingStrings } from '../Rating/stars';

export interface ReviewSummaryProps {
  /** The average rating, 0–5: shown large with one decimal and as stars. */
  average: number;
  /** Reviews per star level: { 5: 92, 4: 20, 3: 8, 2: 3, 1: 5 }. */
  distribution: Partial<Record<1 | 2 | 3 | 4 | 5, number>>;
  /** Defaults to the sum of the distribution. */
  count?: number;
  /** Makes the bars toggle buttons (emits `filter`). */
  filterable?: boolean;
  /** The star level being filtered on, if any. */
  active?: number | null;
  /** Translations; or once for the shop with configure() under strings.reviewSummary. filter names a filter button: "5 stars, 20 reviews". */
  strings?: {
    outOf?: string;
    reviews?: (n: number) => string;
    filter?: (stars: number, n: number) => string;
    bars?: string;
  };
}

const props = withDefaults(defineProps<ReviewSummaryProps>(), { count: undefined, active: null, strings: undefined });
const emit = defineEmits<{
  /** A bar was pressed: the level, or null to show all again. */ filter: [stars: number | null];
}>();
defineSlots<{ /** Under the bars: a "Write a review" button. */ action?(): unknown }>();

const slots = useSlots();
const strings = useStrings(
  'reviewSummary',
  {
    outOf: 'out of 5',
    reviews: (n: number) => (n === 1 ? '1 review' : `${fmt(n)} reviews`),
    filter: (s: number, n: number) =>
      `${s} ${s === 1 ? 'star' : 'stars'}, ${n === 1 ? '1 review' : `${fmt(n)} reviews`}`,
    bars: 'Reviews by rating',
  },
  () => props.strings,
);
// "5 stars" for the plain rows comes from the shared rating namespace, so configure({ strings: { rating: { stars } } }) translates it.
const ratingStrings = useStrings<Required<RatingStrings>>('rating', ratingDefaults());
const LEVELS = [5, 4, 3, 2, 1] as const;
const of = (k: 1 | 2 | 3 | 4 | 5) => props.distribution[k] ?? 0;
const total = computed(() => props.count ?? LEVELS.reduce((a, k) => a + of(k), 0));
const most = computed(() => Math.max(1, ...LEVELS.map(of)));
</script>

<template>
  <div class="q-rsum">
    <div class="q-rsum__head">
      <span class="q-rsum__avg"
        >{{ oneDecimal(average || 0) }}<span class="q-visually-hidden">{{ ` ${strings.outOf}` }}</span></span
      >
      <span class="q-rsum__side">
        <QStars :value="average || 0" class="q-stars--md" />
        <span class="q-rsum__count">{{ strings.reviews(total) }}</span>
      </span>
    </div>
    <ul class="q-rsum__bars" :aria-label="strings.bars">
      <li v-for="k in LEVELS" :key="k">
        <button
          v-if="filterable"
          type="button"
          :class="['q-rsum__row', active === k && 'is-active']"
          :aria-pressed="active === k"
          :disabled="!of(k)"
          @click="emit('filter', active === k ? null : k)"
        >
          <!-- Named by its content, not an aria-label, so the name starts with what's visible: "5 stars, 20 reviews" (WCAG 2.5.3). -->
          <span class="q-rsum__lvl" aria-hidden="true"
            >{{ k }}<svg viewBox="0 0 20 20"><path :d="STAR_PATH" /></svg
          ></span>
          <span class="q-rsum__bar" aria-hidden="true"><span :style="{ width: `${(of(k) / most) * 100}%` }" /></span>
          <span class="q-rsum__n" aria-hidden="true">{{ fmt(of(k)) }}</span>
          <span class="q-visually-hidden">{{ strings.filter(k, of(k)) }}</span>
        </button>
        <span v-else class="q-rsum__row">
          <span class="q-rsum__lvl" aria-hidden="true"
            >{{ k }}<svg viewBox="0 0 20 20"><path :d="STAR_PATH" /></svg
          ></span>
          <span class="q-rsum__bar" aria-hidden="true"><span :style="{ width: `${(of(k) / most) * 100}%` }" /></span>
          <span class="q-rsum__n" aria-hidden="true">{{ fmt(of(k)) }}</span>
          <span class="q-visually-hidden">{{ strings.reviews(of(k)) }} — {{ ratingStrings.stars(k) }}</span>
        </span>
      </li>
    </ul>
    <div v-if="slots.action" class="q-rsum__action"><slot name="action" /></div>
  </div>
</template>
