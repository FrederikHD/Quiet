<script setup lang="ts">
import { QButton, QToaster } from '@frederikhd/quiet';

const { lang, t, path, href } = useShop();
const { count } = useCart();
const route = useRoute();
const link = useInAppLink();
const base = useRuntimeConfig().app.baseURL;

useHead(() => ({ htmlAttrs: { lang: lang.value } }));
// After moving to another page in the app, focus its heading, so screen readers start there, as after a page load.
const nuxtApp = useNuxtApp();
let hydrated = false;
nuxtApp.hook('page:finish', () => {
  if (!hydrated) return void (hydrated = true);
  document.querySelector<HTMLElement>('main h1')?.focus();
});
// The other language, on the same page. A full page load: each language is rendered and set up on its own.
const other = computed(() => `${base}${lang.value === 'de' ? 'en' : 'de'}${route.path.slice(3)}`);
</script>

<template>
  <div class="shop">
    <a class="shop__skip" href="#main">{{ lang === 'de' ? 'Zum Inhalt springen' : 'Skip to content' }}</a>
    <header class="shop__header">
      <NuxtLink class="shop__brand" :to="path()">{{ t.shop }}</NuxtLink>
      <nav class="shop__nav" :aria-label="t.language">
        <a :href="other" :hreflang="lang === 'de' ? 'en' : 'de'" :lang="lang === 'de' ? 'en' : 'de'">
          {{ t.otherLanguage }}
        </a>
      </nav>
      <QButton
        :href="href('/cart')"
        variant="ghost"
        icon-start="cart"
        :aria-label="t.cart"
        :count="count"
        :count-label="t.cartItems"
        @click="link(href('/cart'))($event)"
      />
    </header>
    <main id="main" class="shop__main" tabindex="-1">
      <slot />
    </main>
    <footer class="shop__footer">
      <p>{{ t.footer }} {{ t.demo }}</p>
      <p>
        <a href="https://frederikhd.github.io/Quiet/">{{ t.docs }}</a>
      </p>
    </footer>
    <QToaster />
  </div>
</template>
