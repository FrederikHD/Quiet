<script setup lang="ts">
// Page's two columns on their own, for a Form that has to wrap both (one error summary, one sticky Save):
// <QPage><QForm><QPageColumns>…<template #aside>…</template></QPageColumns><QFormActions sticky /></QForm></QPage>
defineSlots<{
  /** The main column. */
  default?(): unknown;
  /** The side column: 2 : 1 from 900px of page width, below the main column on smaller screens. */
  aside?(): unknown;
}>();
</script>

<template>
  <div class="q-page__columns">
    <div class="q-page__main"><slot /></div>
    <div class="q-page__aside"><slot name="aside" /></div>
  </div>
</template>
