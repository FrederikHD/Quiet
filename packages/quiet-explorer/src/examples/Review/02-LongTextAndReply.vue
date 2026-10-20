<!-- Long text folds after five lines with "Read more"; the shop's reply sits in its own block under it. -->
<script setup lang="ts">
import { QReview } from '@frederikhd/quiet';
</script>

<template>
  <QReview
    :rating="3"
    title="Creases easily"
    author="Paul W."
    date="14 September 2026"
    verified
    :details="['Size M', 'Sand']"
  >
    <p>
      The colour is exactly as in the pictures and the fit is good: roomy across the shoulders without looking baggy,
      and the sleeves are long enough for my arms, which is rare. The buttons feel solid and the collar keeps its shape.
      But it creases the moment you sit down, and after a train ride it looks like I slept in it. I knew linen creases,
      but this is more than my other linen shirts. Steaming helps for an hour or so. I'll keep it for weekends, where I
      mind less, but I wouldn't buy it again for the office. Washing it at 30° and hanging it straight away helped a
      little.
    </p>
    <template #reply>
      <p>
        Thank you, Paul. Washed linen creases more than pressed linen: that's what makes it soft. Our heavy linen shirt
        holds its shape better for the office.
      </p>
    </template>
  </QReview>
</template>
