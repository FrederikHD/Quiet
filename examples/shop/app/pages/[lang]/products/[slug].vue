<script setup lang="ts">
import {
  QBreadcrumbs,
  QButton,
  QDisclosure,
  QForm,
  QGallery,
  QPrice,
  QProductCard,
  QQuantityStepper,
  QRadio,
  QRadioGroup,
  QRating,
  QReview,
  QReviewSummary,
  toast,
} from '@frederikhd/quiet';
import { photo, swatchOf } from '~/data/pictures';
import { productBySlug, products, ratingOf } from '~/data/products';

const { lang, t, path, href } = useShop();
const link = useInAppLink();
const route = useRoute();
const product = computed(() => productBySlug(String(route.params.slug)));
if (!product.value) throw createError({ statusCode: 404, statusMessage: 'Not found' });
const p = computed(() => product.value!);
const name = computed(() => p.value.name[lang.value]);
useHead(() => ({ title: `${name.value} · ${t.value.shop}` }));

const colour = ref(p.value.colours[0]!);
const size = ref<string | null>(p.value.sizes.length === 1 ? p.value.sizes[0]! : null);
const quantity = ref(1);
const tried = ref(false);
const colourName = (c: string) => t.value.colourNames[c] ?? c;
const images = computed(() =>
  (['front', 'back', 'folded'] as const).map((view, i) => ({
    src: photo(colour.value, i),
    alt: `${name.value}, ${colourName(colour.value)}, ${t.value.view[view]}`,
  })),
);

const { add } = useCart();
function submit() {
  tried.value = true;
  if (!size.value) return;
  add({ slug: p.value.slug, colour: colour.value, size: size.value, quantity: quantity.value });
  toast(t.value.added(name.value), {
    tone: 'success',
    action: { label: t.value.viewCart, onClick: () => navigateTo(path('/cart')) },
  });
  quantity.value = 1;
}

const rating = computed(() => ratingOf(p.value));
const distribution = computed(() => {
  const d: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const r of p.value.reviews) d[r.stars]!++;
  return d;
});
const related = computed(() => products.filter((x) => x.slug !== p.value.slug).slice(0, 4));
</script>

<template>
  <div class="page">
    <QBreadcrumbs
      :items="[{ label: t.home, href: href() }, { label: t.allProducts, href: href() }, { label: name }]"
      @navigate="(item, e) => item.href && link(item.href)(e)"
    />

    <div class="product">
      <QGallery class="product__gallery" :label="t.images(name)" :images="images" />

      <div class="product__buy">
        <div class="product__head">
          <h1 class="product__title" tabindex="-1">{{ name }}</h1>
          <QRating v-if="rating" :value="rating.value" :count="rating.count" href="#reviews" />
        </div>
        <QPrice :amount="p.price" :compare-at="p.compareAt" size="large" tax-note />

        <QForm label-placement="top" @submit.prevent="submit">
          <QRadioGroup v-model="colour" :label="t.colour" layout="swatches">
            <QRadio v-for="c in p.colours" :key="c" :value="c" :label="colourName(c)" :swatch="swatchOf(c)" />
          </QRadioGroup>
          <QRadioGroup
            v-model="size"
            :label="t.size"
            layout="buttons"
            required
            :error="tried && !size ? t.chooseSize : null"
          >
            <QRadio v-for="s in p.sizes" :key="s" :value="s" :label="s" />
          </QRadioGroup>
          <div class="product__add">
            <QQuantityStepper v-model="quantity" :aria-label="t.quantity" size="large" :max="10" />
            <QButton variant="primary" size="large" icon-start="cart" full-width type="submit">
              {{ t.addToCart }}
            </QButton>
          </div>
        </QForm>

        <div>
          <QDisclosure :title="t.description" default-open>{{ p.description[lang] }}</QDisclosure>
          <QDisclosure :title="t.care" :meta="t.careMeta">{{ t.careText }}</QDisclosure>
          <QDisclosure :title="t.delivery">{{ t.deliveryText }}</QDisclosure>
        </div>
      </div>
    </div>

    <section v-if="rating" id="reviews" class="section" aria-labelledby="reviews-title">
      <h2 id="reviews-title" class="section__title">{{ t.reviews }}</h2>
      <div class="reviews">
        <QReviewSummary :average="rating.value" :distribution="distribution" />
        <ul class="reviews__list" :aria-label="t.reviews">
          <li v-for="r in p.reviews" :key="r.id">
            <QReview
              :rating="r.stars"
              :title="r.title[lang]"
              :author="r.author"
              :date="new Date(r.date)"
              verified
              :details="[`${t.size} ${r.size}`, colourName(r.colour)]"
            >
              <p>{{ r.text[lang] }}</p>
            </QReview>
          </li>
        </ul>
      </div>
    </section>

    <section class="section" aria-labelledby="related-title">
      <h2 id="related-title" class="section__title">{{ t.related }}</h2>
      <ul class="grid">
        <li v-for="r in related" :key="r.slug">
          <QProductCard
            :name="r.name[lang]"
            :href="href(`/products/${r.slug}`)"
            :image="{ src: photo(r.colours[0]!) }"
            :price="r.price"
            :compare-at="r.compareAt"
            :rating="ratingOf(r)"
            @navigate="link(href(`/products/${r.slug}`))($event)"
          />
        </li>
      </ul>
    </section>
  </div>
</template>
