<script setup lang="ts">
import { QButton, QEmptyState, QOrderSummary, QQuantityStepper, money } from '@frederikhd/quiet';
import { photo } from '~/data/pictures';
import { productBySlug } from '~/data/products';
import type { CartLine } from '~/composables/useCart';

const { lang, t, path, href } = useShop();
const link = useInAppLink();
useHead(() => ({ title: `${t.value.cart} · ${t.value.shop}` }));

const { lines, subtotal } = useCart();
const colourName = (c: string) => t.value.colourNames[c] ?? c;
const nameOf = (l: CartLine) => productBySlug(l.slug)?.name[lang.value] ?? l.slug;
const variantOf = (l: CartLine) => `${colourName(l.colour)} · ${l.size}`;
const shipping = computed(() => (subtotal.value >= 50 ? 0 : t.value.shippingCost));

// A line stepped down to 0 leaves the cart. Focus moves to the quantity of the line that took its place (or the one
// before it), or to the heading once the cart is empty, rather than dropping to the page.
async function setQuantity(line: CartLine, n: number) {
  if (n > 0) {
    line.quantity = n;
    return;
  }
  const i = lines.value.indexOf(line);
  lines.value = lines.value.filter((l) => l !== line);
  await nextTick();
  const left = document.querySelectorAll<HTMLElement>('.cart__line input');
  (left.length ? left[Math.min(i, left.length - 1)] : document.querySelector<HTMLElement>('main h1'))?.focus();
}
</script>

<template>
  <div class="page">
    <div class="page__head">
      <h1 class="page__title" tabindex="-1">{{ t.cart }}</h1>
    </div>

    <ClientOnly>
      <QEmptyState v-if="!lines.length" :title="t.emptyCart" icon="cart" :heading-level="2">
        {{ t.emptyCartText }}
        <template #actions>
          <QButton :href="href()" @click="link(href())($event)">{{ t.keepShopping }}</QButton>
        </template>
      </QEmptyState>

      <div v-else class="columns">
        <ul class="cart" :aria-label="t.cart">
          <li v-for="line in lines" :key="`${line.slug}-${line.colour}-${line.size}`" class="cart__line">
            <img class="cart__img" :src="photo(line.colour)" alt="" width="72" height="90" />
            <div class="cart__text">
              <NuxtLink :to="path(`/products/${line.slug}`)" class="cart__name">{{ nameOf(line) }}</NuxtLink>
              <span class="cart__variant">{{ variantOf(line) }}</span>
              <QQuantityStepper
                :model-value="line.quantity"
                :aria-label="`${t.quantity}: ${nameOf(line)}, ${variantOf(line)}`"
                :min="0"
                :max="10"
                @update:model-value="setQuantity(line, $event)"
              />
            </div>
            <span class="cart__price">{{ money(line.quantity * (productBySlug(line.slug)?.price ?? 0)) }}</span>
          </li>
        </ul>

        <aside class="columns__side">
          <QOrderSummary
            :items="[]"
            :subtotal="subtotal"
            :totals="[{ label: t.shipping, amount: shipping, free: !shipping }]"
            :total="subtotal + shipping"
            :tax-note="t.taxNote"
          />
          <QButton
            variant="primary"
            size="large"
            full-width
            :href="href('/checkout')"
            @click="link(href('/checkout'))($event)"
          >
            {{ t.checkout }}
          </QButton>
        </aside>
      </div>
    </ClientOnly>
  </div>
</template>
