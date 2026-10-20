<!-- A storefront product page, built only from Quiet's components (plus the store's own header). -->
<script setup lang="ts">
import {
  QBreadcrumbs,
  QButton,
  QDialog,
  QDisclosure,
  QEmptyState,
  QForm,
  QGallery,
  QIcon,
  QPrice,
  QProductCard,
  QQuantityStepper,
  QRadio,
  QRadioGroup,
  QRating,
  QReview,
  QReviewSummary,
  QSelect,
  money,
  toast,
} from '@frederikhd/quiet';
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { photo, swatchOf } from '../fixtures/pictures';
import StoreHeader from './StoreHeader.vue';

const name = 'Linen shirt';
const price = 59;
const colours = ['Navy', 'Sand', 'Olive', 'Rust'];
const sizes = ['XS', 'S', 'M', 'L', 'XL'];
// Sold-out sizes per colour: still choosable, so the button can offer "Notify me" instead.
const soldOut: Record<string, string[]> = { Navy: ['XL'], Sand: ['XS', 'XL'], Olive: [], Rust: ['S'] };

const colour = ref('Navy');
const size = ref<string | null>(null);
const quantity = ref(1);
const tried = ref(false);
const isSoldOut = computed(() => !!size.value && soldOut[colour.value].includes(size.value));
const images = computed(() =>
  ['front', 'back', 'folded'].map((view, i) => ({
    src: photo(colour.value, i),
    alt: `${name} in ${colour.value.toLowerCase()}, ${view}`,
  })),
);
// A size that is sold out in the new colour stays chosen: the button then offers "Notify me".
watch(colour, () => (tried.value = false));

// The cart.
interface Line {
  key: string;
  colour: string;
  size: string;
  quantity: number;
}
const lines = ref<Line[]>([{ key: 'Sand-M', colour: 'Sand', size: 'M', quantity: 1 }]);
const cartOpen = ref(false);
const cartCount = computed(() => lines.value.reduce((n, l) => n + l.quantity, 0));
const subtotal = computed(() => cartCount.value * price);

function submit() {
  tried.value = true;
  if (!size.value) return;
  if (isSoldOut.value) {
    toast(`We’ll email you when the ${name.toLowerCase()} in ${colour.value.toLowerCase()}, ${size.value} is back.`);
    return;
  }
  const key = `${colour.value}-${size.value}`;
  const line = lines.value.find((l) => l.key === key);
  if (line) line.quantity += quantity.value;
  else lines.value.push({ key, colour: colour.value, size: size.value, quantity: quantity.value });
  toast(`Added ${name} to your cart`, {
    tone: 'success',
    action: { label: 'View cart', onClick: () => (cartOpen.value = true) },
  });
}
// A line stepped down to 0 leaves the cart.
function setQuantity(line: Line, n: number) {
  if (n > 0) line.quantity = n;
  else lines.value = lines.value.filter((l) => l !== line);
}

// Reviews: filtered by the summary's bars, sorted, 3 at a time; "Helpful" votes are kept here as a server would.
const reviews = reactive([
  {
    id: 1,
    stars: 5,
    title: 'Soft from the first wash',
    author: 'Anna S.',
    date: new Date(2026, 9, 12),
    details: ['Size M', 'Navy'],
    helpful: 14,
    text: 'I wear it to work and at the weekend. The linen is soft without being thin, and the navy hasn’t faded after a dozen washes.',
  },
  {
    id: 2,
    stars: 5,
    title: 'Perfect for summer',
    author: 'Jonas W.',
    date: new Date(2026, 9, 3),
    details: ['Size L', 'Sand'],
    helpful: 6,
    text: 'Cool on the hottest days of August. Roomy without looking baggy.',
  },
  {
    id: 3,
    stars: 4,
    title: 'Lovely, runs a little large',
    author: 'Lea F.',
    date: new Date(2026, 8, 28),
    details: ['Size S', 'Sand'],
    helpful: 21,
    text: 'Beautiful colour and soft linen. I usually wear a medium and the small fits well, so order a size down.',
  },
  {
    id: 4,
    stars: 3,
    title: 'Creases easily',
    author: 'Paul W.',
    date: new Date(2026, 8, 14),
    details: ['Size M', 'Sand'],
    helpful: 9,
    text: 'The fit is good: roomy across the shoulders, and the sleeves are long enough for my arms, which is rare. The buttons feel solid and the collar keeps its shape. But it creases the moment you sit down, and after a train ride it looks like I slept in it. I knew linen creases, but this is more than my other linen shirts. Steaming helps for an hour or so. I’ll keep it for weekends, where I mind less, but I wouldn’t buy it again for the office.',
    reply:
      'Thank you, Paul. Washed linen creases more than pressed linen: that’s what makes it soft. Our heavy linen shirt holds its shape better for the office.',
  },
  {
    id: 5,
    stars: 5,
    title: 'Third one I’ve bought',
    author: 'Mia B.',
    date: new Date(2026, 7, 30),
    details: ['Size S', 'Olive'],
    helpful: 3,
    text: 'Now in olive, navy and sand. Washes well at 30°.',
  },
]);
const onlyStars = ref<number | null>(null);
const reviewSort = ref('recent');
const reviewPage = 3;
const reviewsShown = ref(reviewPage);
const votes = ref(new Set<number>());
const shownReviews = computed(() =>
  reviews
    .filter((r) => !onlyStars.value || r.stars === onlyStars.value)
    .sort((a, b) =>
      reviewSort.value === 'helpful'
        ? b.helpful - a.helpful
        : reviewSort.value === 'high'
          ? b.stars - a.stars
          : reviewSort.value === 'low'
            ? a.stars - b.stars
            : +b.date - +a.date,
    ),
);
watch([onlyStars, reviewSort], () => (reviewsShown.value = reviewPage));
const reviewList = ref<HTMLElement | null>(null);
async function moreReviews() {
  const first = reviewsShown.value;
  reviewsShown.value += reviewPage;
  await nextTick();
  reviewList.value?.querySelectorAll<HTMLElement>('.q-review')[first]?.focus();
}
function vote(id: number, on: boolean) {
  const r = reviews.find((x) => x.id === id)!;
  r.helpful += on ? 1 : -1;
  if (on) votes.value.add(id);
  else votes.value.delete(id);
}

const related = [
  { name: 'Linen trousers', colour: 'Navy', price: 79, compareAt: 99, rating: { value: 4.6, count: 18 } },
  { name: 'Linen shorts', colour: 'Sand', price: 49, rating: { value: 4.1, count: 9 } },
  { name: 'Linen overshirt', colour: 'Olive', price: 99 },
  { name: 'Linen scarf', colour: 'Rust', price: 29, soldOut: true },
];
</script>

<template>
  <div class="store">
    <StoreHeader :cart-count="cartCount" :cart-open="cartOpen" @open-cart="cartOpen = true" />

    <main class="store__main">
      <div class="store__top">
        <QBreadcrumbs
          :items="[
            { label: 'Home', href: '#store' },
            { label: 'Men', href: '#men' },
            { label: 'Shirts', href: '#shirts' },
            { label: name },
          ]"
        />

        <div class="product">
          <QGallery class="product__gallery" :label="`${name} images`" :images="images" />

          <div class="product__buy">
            <div class="product__head">
              <p class="product__vendor">Leinenweberei Rhön</p>
              <h2 class="product__title">{{ name }}</h2>
              <QRating :value="4.3" :count="31" href="#reviews" />
            </div>
            <QPrice :amount="price" size="large" tax-note />

            <QForm label-placement="top" @submit.prevent="submit">
              <QRadioGroup v-model="colour" label="Colour" layout="swatches">
                <QRadio v-for="c in colours" :key="c" :value="c" :label="c" :swatch="swatchOf(c)" />
              </QRadioGroup>
              <QRadioGroup
                v-model="size"
                label="Size"
                layout="buttons"
                required
                :error="tried && !size ? 'Choose a size' : null"
                :hint="isSoldOut ? `Sold out in ${size}. We can email you when it’s back.` : undefined"
              >
                <QRadio v-for="s in sizes" :key="s" :value="s" :label="s" :sold-out="soldOut[colour].includes(s)" />
              </QRadioGroup>
              <!-- The brand book puts the quantity beside Add to cart. -->
              <div class="product__add">
                <QQuantityStepper
                  v-model="quantity"
                  aria-label="Quantity"
                  size="large"
                  :max="10"
                  :disabled="isSoldOut"
                />
                <QButton
                  variant="primary"
                  size="large"
                  :icon-start="isSoldOut ? 'mail' : 'cart'"
                  full-width
                  type="submit"
                >
                  {{ isSoldOut ? 'Notify me' : 'Add to cart' }}
                </QButton>
              </div>
            </QForm>

            <ul class="product__perks">
              <li><QIcon name="truck" /> Free delivery from 50 €, in 2–4 working days</li>
              <li><QIcon name="refresh" /> 30 days to return it, free of charge</li>
            </ul>

            <div>
              <QDisclosure title="Description" default-open>
                A relaxed shirt in washed linen from the Rhön, cut a little long to wear open over a T-shirt or tucked
                in. It gets softer with every wash.
              </QDisclosure>
              <QDisclosure title="Material and care" meta="100 % linen">
                100 % European linen. Machine wash at 40 °C, hang to dry, iron while damp.
              </QDisclosure>
              <QDisclosure title="Delivery and returns">
                Free delivery from 50 €. Returns within 30 days are free: the label is in the parcel.
              </QDisclosure>
            </div>
          </div>
        </div>
      </div>

      <section id="reviews" class="section" aria-labelledby="reviews-title">
        <h2 id="reviews-title" class="section__title">Reviews</h2>
        <div class="reviews">
          <QReviewSummary
            :average="4.3"
            :distribution="{ 5: 20, 4: 7, 3: 2, 2: 1, 1: 1 }"
            filterable
            :active="onlyStars"
            @filter="onlyStars = $event"
          >
            <template #action><QButton icon-start="pencil">Write a review</QButton></template>
          </QReviewSummary>
          <div class="reviews__main">
            <QSelect
              v-model="reviewSort"
              size="slim"
              aria-label="Sort reviews"
              class="reviews__sort"
              :options="[
                { value: 'recent', label: 'Most recent' },
                { value: 'helpful', label: 'Most helpful' },
                { value: 'high', label: 'Highest rated' },
                { value: 'low', label: 'Lowest rated' },
              ]"
            />
            <ul ref="reviewList" class="reviews__list" aria-label="Reviews">
              <li v-for="r in shownReviews.slice(0, reviewsShown)" :key="r.id">
                <QReview
                  :rating="r.stars"
                  :title="r.title"
                  :author="r.author"
                  :date="r.date"
                  verified
                  :details="r.details"
                  :helpful="r.helpful"
                  :voted="votes.has(r.id)"
                  tabindex="-1"
                  @vote="(on) => vote(r.id, on)"
                >
                  <p>{{ r.text }}</p>
                  <template v-if="r.reply" #reply>
                    <p>{{ r.reply }}</p>
                  </template>
                </QReview>
              </li>
              <li v-if="!shownReviews.length" class="reviews__none">No reviews with {{ onlyStars }} stars yet.</li>
            </ul>
            <div v-if="reviewsShown < shownReviews.length" class="reviews__more">
              <p>Showing {{ reviewsShown }} of {{ shownReviews.length }}</p>
              <QButton @click="moreReviews">Show more reviews</QButton>
            </div>
          </div>
        </div>
      </section>

      <section class="section" aria-labelledby="related-title">
        <h2 id="related-title" class="section__title">You may also like</h2>
        <ul class="related">
          <li v-for="p in related" :key="p.name">
            <QProductCard
              :name="p.name"
              :href="`#${p.name.toLowerCase().replace(/ /g, '-')}`"
              :image="{ src: photo(p.colour) }"
              :price="p.price"
              :compare-at="p.compareAt"
              :rating="p.rating"
              :sold-out="p.soldOut"
            />
          </li>
        </ul>
      </section>
    </main>

    <QDialog v-model:open="cartOpen" placement="end" :title="`Cart (${cartCount})`">
      <QEmptyState v-if="!lines.length" title="Your cart is empty" icon="cart">
        Find something you like and it will wait here.
      </QEmptyState>
      <ul v-else class="cart">
        <li v-for="line in lines" :key="line.key" class="cart__line">
          <img class="cart__img" :src="photo(line.colour)" alt="" />
          <div class="cart__text">
            <strong>{{ name }}</strong>
            <span class="cart__variant">{{ line.colour }} · {{ line.size }}</span>
            <QQuantityStepper
              :model-value="line.quantity"
              :aria-label="`Quantity of ${name}, ${line.colour}, ${line.size}`"
              :min="0"
              :max="10"
              @update:model-value="setQuantity(line, $event ?? 0)"
            />
          </div>
          <span class="cart__price">{{ money(line.quantity * price) }}</span>
        </li>
      </ul>
      <template v-if="lines.length" #footer>
        <div class="cart__total">
          <span>Subtotal</span><strong>{{ money(subtotal) }}</strong>
          <small>Including VAT. Shipping is calculated at checkout.</small>
        </div>
        <QButton variant="primary" size="large" full-width @click="toast('On to the checkout')">Check out</QButton>
      </template>
    </QDialog>
  </div>
</template>

<style scoped>
.store {
  background: var(--surface);
}
.store__main {
  display: grid;
  gap: var(--space-16);
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-4) var(--space-6) var(--space-16);
}
.store__top {
  display: grid;
  gap: var(--space-6);
}
.product {
  display: grid;
  gap: var(--space-8);
}
@container (min-width: 760px) {
  .product {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    align-items: start;
  }
}
.product__buy {
  display: grid;
  gap: var(--space-6);
}
.product__head {
  display: grid;
  justify-items: start;
  gap: var(--space-1);
}
.product__vendor {
  margin: 0;
  color: var(--ink-muted);
  font: var(--text-small);
}
.product__title {
  margin: 0;
  font: var(--text-display);
}
.product__add {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}
/* Beside the stepper while the label fits on one line, under it on narrow phones. */
.product__add > :last-child {
  flex: 1 1 12rem;
}
.product__perks {
  display: grid;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--ink-muted);
  font: var(--text-small);
}
.product__perks li {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.section {
  display: grid;
  gap: var(--space-4);
}
.section__title {
  margin: 0;
  font: var(--text-heading);
}
.reviews {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
  gap: var(--space-8);
  align-items: start;
}
.reviews__main {
  display: grid;
  gap: var(--space-4);
  min-width: 0;
}
.reviews__sort {
  width: auto;
  justify-self: start;
}
.reviews__list {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}
.reviews__list > li {
  padding: var(--space-6) 0;
  border-bottom: 1px solid var(--line);
}
.reviews__list > li:first-child {
  padding-top: 0;
}
.reviews__none {
  color: var(--ink-muted);
}
.reviews__more {
  display: grid;
  justify-items: center;
  gap: var(--space-3);
}
.reviews__more p {
  margin: 0;
  color: var(--ink-muted);
  font: var(--text-small);
}
.related {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(180px, 100%), 1fr));
  gap: var(--space-6) var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}
.cart {
  display: grid;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}
.cart__line {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: var(--space-3);
  align-items: start;
}
.cart__img {
  width: 64px;
  aspect-ratio: 4 / 5;
  border-radius: var(--radius-sm);
  object-fit: cover;
}
.cart__text {
  display: grid;
  justify-items: start;
  gap: var(--space-1);
}
.cart__variant {
  color: var(--ink-muted);
  font: var(--text-small);
}
.cart__total {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-1);
  width: 100%;
}
.cart__total small {
  flex-basis: 100%;
  color: var(--ink-muted);
  font: var(--text-caption);
}
</style>
