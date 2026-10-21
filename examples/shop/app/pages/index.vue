<script setup lang="ts">
// The start page: choose a language. Each language has its own pages (/en/…, /de/…).
definePageMeta({ layout: false });
useHead({ title: 'Linen & Co.', htmlAttrs: { lang: 'en' } });
</script>

<template>
  <main class="shop__main choose">
    <h1 class="page__title">Linen &amp; Co.</h1>
    <p class="page__intro">A demo shop built with Nuxt and Quiet, in English and German.</p>
    <ul class="choose__list">
      <li><NuxtLink to="/en">English</NuxtLink></li>
      <li><NuxtLink to="/de" hreflang="de" lang="de">Deutsch</NuxtLink></li>
    </ul>
  </main>
</template>
