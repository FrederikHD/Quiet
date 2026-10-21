<script setup lang="ts">
import { QButton, QEmptyState } from '@frederikhd/quiet';
import type { NuxtError } from '#app';

defineProps<{ error: NuxtError }>();
const de = useRequestURL().pathname.includes('/de/');
useHead({ title: de ? 'Seite nicht gefunden' : 'Page not found', htmlAttrs: { lang: de ? 'de' : 'en' } });
</script>

<template>
  <main class="shop__main error-page">
    <QEmptyState :title="de ? 'Diese Seite gibt es nicht' : 'There’s no page here'" icon="search" :heading-level="1">
      {{
        error.statusCode === 404 ? (de ? 'Der Link ist vielleicht veraltet.' : 'The link may be old.') : error.message
      }}
      <template #actions>
        <QButton @click="clearError({ redirect: de ? '/de' : '/en' })">{{
          de ? 'Zur Startseite' : 'Go to the shop'
        }}</QButton>
      </template>
    </QEmptyState>
  </main>
</template>
