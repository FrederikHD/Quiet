<script setup lang="ts">
import { QProductCard, QSelect } from '@frederikhd/quiet';
import { photo, swatchOf } from '~/data/pictures';
import { products, ratingOf } from '~/data/products';

const { lang, t, href } = useShop();
const link = useInAppLink();
useHead(() => ({ title: `${t.value.allProducts} · ${t.value.shop}` }));

const sort = ref('featured');
const sorted = computed(() =>
  sort.value === 'featured'
    ? products
    : [...products].sort((a, b) => (sort.value === 'low' ? a.price - b.price : b.price - a.price)),
);
</script>

<template>
  <div class="page">
    <div class="page__head">
      <h1 class="page__title" tabindex="-1">{{ t.allProducts }}</h1>
      <p class="page__intro">{{ t.collectionIntro }}</p>
    </div>
    <div class="toolbar">
      <p class="toolbar__count">{{ t.products(products.length) }}</p>
      <QSelect
        v-model="sort"
        :aria-label="t.sortBy"
        size="slim"
        class="toolbar__sort"
        :options="[
          { value: 'featured', label: t.sortFeatured },
          { value: 'low', label: t.sortLow },
          { value: 'high', label: t.sortHigh },
        ]"
      />
    </div>
    <ul class="grid">
      <li v-for="p in sorted" :key="p.slug">
        <QProductCard
          :name="p.name[lang]"
          :href="href(`/products/${p.slug}`)"
          :image="{ src: photo(p.colours[0]!) }"
          :hover-image="{ src: photo(p.colours[0]!, 1) }"
          :price="p.price"
          :compare-at="p.compareAt"
          :rating="ratingOf(p)"
          :swatches="p.colours.map((c) => ({ label: t.colourNames[c] ?? c, color: swatchOf(c) }))"
          :heading-level="2"
          @navigate="link(href(`/products/${p.slug}`))($event)"
        />
      </li>
    </ul>
  </div>
</template>
