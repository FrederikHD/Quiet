<script setup lang="ts">
import { computed } from 'vue';
import { useStrings } from '../../config';
import { useQuietId } from '../../composables/useQuietId';
import QBadge, { type BadgeTone } from '../Badge/QBadge.vue';
import QButton from '../Button/QButton.vue';
import QIcon from '../Icon/QIcon.vue';
import QPrice from '../Price/QPrice.vue';
import QRating from '../Rating/QRating.vue';

export interface ProductCardProps {
  name: string;
  href?: string;
  image?: { src: string; alt?: string };
  /** Shown on hover (pointer devices): the back, or the product worn. */
  hoverImage?: { src: string };
  price?: number;
  compareAt?: number;
  /** "from" before the price, when variants differ. */
  priceFrom?: boolean;
  currency?: string;
  /** Stars and count under the price; hidden while count is 0. */
  rating?: { value: number; count: number } | null;
  /** Top left on the image: Sale (sale), New (info), Sold out (neutral). One or two. */
  badges?: ({ label: string; tone?: BadgeTone } | null | false)[];
  /** Colour dots under the price. */
  swatches?: { label: string; color: string }[];
  /** Default 5; the rest show as "+2". */
  maxSwatches?: number;
  vendor?: string;
  /** Dims the image and hides quick add. */
  soldOut?: boolean;
  /** Adds a round + button on the image, "Add <name> to cart" (emits `quick-add`). */
  quickAdd?: boolean;
  /** portrait (4:5, default) or square. One per catalogue. */
  aspect?: 'portrait' | 'square';
  /** The name's heading level. Default 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  strings?: { quickAdd?: (name: string) => string; colours?: (n: number) => string; more?: (n: number) => string };
}

const props = withDefaults(defineProps<ProductCardProps>(), {
  href: undefined,
  image: undefined,
  hoverImage: undefined,
  price: undefined,
  compareAt: undefined,
  currency: undefined,
  rating: undefined,
  badges: undefined,
  swatches: () => [],
  maxSwatches: 5,
  vendor: undefined,
  aspect: 'portrait',
  headingLevel: 3,
  strings: undefined,
});
const emit = defineEmits<{
  /** The product link was clicked (for client-side routing). */
  navigate: [event: MouseEvent];
  'quick-add': [];
}>();

const strings = useStrings(
  'productCard',
  {
    quickAdd: (name: string) => `Add ${name} to cart`,
    colours: (n: number) => (n === 1 ? '1 colour' : `${n} colours`),
    more: (n: number) => `+${n}`,
  },
  () => props.strings,
);
const nameId = useQuietId('q-pcard-');
const badges = computed(() => (props.badges ?? []).filter((b): b is { label: string; tone?: BadgeTone } => !!b));
</script>

<template>
  <!-- The image is the card: no border. One link (the name) covers the whole card, so a card is one Tab stop. -->
  <article :class="['q-pcard', aspect === 'square' && 'q-pcard--square', soldOut && 'is-soldout']" :aria-labelledby="nameId">
    <div class="q-pcard__media">
      <img v-if="image?.src" class="q-pcard__img" :src="image.src" :alt="image.alt ?? ''" loading="lazy" decoding="async" />
      <span v-else class="q-pcard__placeholder" aria-hidden="true"><QIcon name="image" /></span>
      <img
        v-if="hoverImage?.src"
        class="q-pcard__img q-pcard__img--hover"
        :src="hoverImage.src"
        alt=""
        loading="lazy"
        decoding="async"
        aria-hidden="true"
      />
      <div v-if="badges.length" class="q-pcard__badges">
        <QBadge v-for="(b, i) in badges" :key="i" :tone="b.tone ?? 'neutral'">{{ b.label }}</QBadge>
      </div>
    </div>
    <div class="q-pcard__body">
      <div v-if="vendor" class="q-pcard__vendor">{{ vendor }}</div>
      <component :is="`h${headingLevel}`" :id="nameId" class="q-pcard__name">
        <a class="q-pcard__link" :href="href" @click="emit('navigate', $event)">{{ name }}</a>
      </component>
      <QPrice v-if="price != null" :amount="price" :compare-at="compareAt" :from="priceFrom" :currency="currency" size="small" />
      <QRating v-if="rating?.count" :value="rating.value" :count="rating.count" size="small" />
      <div v-if="swatches.length" class="q-pcard__swatches">
        <span class="q-visually-hidden">{{ strings.colours(swatches.length) }}: {{ swatches.map((s) => s.label).join(', ') }}</span>
        <span
          v-for="(s, i) in swatches.slice(0, maxSwatches)"
          :key="i"
          class="q-pcard__dot"
          aria-hidden="true"
          :title="s.label"
          :style="{ '--q-swatch': s.color }"
        />
        <span v-if="swatches.length > maxSwatches" class="q-pcard__more" aria-hidden="true">{{ strings.more(swatches.length - maxSwatches) }}</span>
      </div>
    </div>
    <!-- After the name in the page (so Tab reaches the product first), drawn on the image by the grid. -->
    <QButton
      v-if="quickAdd && !soldOut"
      class="q-pcard__quick"
      variant="secondary"
      icon-start="plus"
      :aria-label="strings.quickAdd(name)"
      @click="emit('quick-add')"
    />
  </article>
</template>
