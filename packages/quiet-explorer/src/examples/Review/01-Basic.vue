<!-- One review: stars, title, who and when, what they bought and the text. Pass a Date and it shows in the shop's locale. -->
<script setup lang="ts">
import { QReview } from '@frederikhd/quiet';
</script>

<template>
  <QReview
    :rating="5"
    title="Soft from the first wash"
    author="Anna S."
    :date="new Date(2026, 9, 12)"
    verified
    :details="['Size M', 'Navy']"
  >
    <p>
      I wear it to work and at the weekend. The linen is soft without being thin, and the navy hasn't faded after a
      dozen washes.
    </p>
  </QReview>
</template>
