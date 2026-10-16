<script setup lang="ts">
import { QButton, QForm, QFormActions, QRatingInput } from 'quiet';
import { computed, ref } from 'vue';

const stars = ref(0);
const tried = ref(false);
const error = computed(() => (tried.value && !stars.value ? 'Choose from 1 to 5 stars' : null));
</script>

<template>
  <div class="pv">
    <QForm label-placement="top" :errors="error ? [{ id: 'pv-rating', message: error }] : null" @submit.prevent="tried = true">
      <QRatingInput id="pv-rating" v-model="stars" label="Your rating" required :error="error" />
      <QFormActions align="start"><QButton type="submit" variant="primary">Send review</QButton></QFormActions>
      <p class="log" role="status">{{ tried && stars ? `Thanks — ${stars} ${stars === 1 ? 'star' : 'stars'}` : '' }}</p>
    </QForm>
  </div>
</template>

<style scoped>
.pv { max-width: 420px; }
.log { margin: 0; min-height: 18px; font: var(--text-small); color: var(--success); }
</style>
