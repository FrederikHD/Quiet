<!-- Required in the review form: send it without stars to see the error and the summary link to the stars. -->
<script setup lang="ts">
import { QButton, QField, QForm, QFormActions, QRatingInput, QTextarea } from '@frederikhd/quiet';
import { computed, ref } from 'vue';

const stars = ref(0);
const text = ref('');
const tried = ref(false);
const error = computed(() => (tried.value && !stars.value ? 'Choose from 1 to 5 stars' : null));
</script>

<template>
  <QForm
    label-placement="top"
    :errors="error ? [{ id: 'review-stars', message: error }] : null"
    class="review"
    @submit.prevent="tried = true"
  >
    <QRatingInput id="review-stars" v-model="stars" label="Your rating" required :error="error" />
    <QField label="Your review"><QTextarea v-model="text" :rows="3" /></QField>
    <QFormActions align="start"><QButton type="submit" variant="primary">Send review</QButton></QFormActions>
  </QForm>
</template>

<style scoped>
.review {
  max-width: 480px;
}
</style>
