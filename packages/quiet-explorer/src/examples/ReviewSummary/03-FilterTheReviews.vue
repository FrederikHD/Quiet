<!-- With filterable each bar is a toggle that shows only those reviews; press it again to show all. Levels without reviews are disabled. -->
<script setup lang="ts">
import { QRating, QReviewSummary } from '@frederikhd/quiet';
import { computed, ref } from 'vue';

const reviews = [
  { id: 1, stars: 5, title: 'Soft from the first wash', by: 'Anna S. · 12 Oct 2026 · Size M' },
  { id: 2, stars: 5, title: 'Perfect for summer', by: 'Jonas W. · 3 Oct 2026 · Size L' },
  { id: 3, stars: 4, title: 'Lovely, runs a little large', by: 'Lea F. · 28 Sep 2026 · Size S' },
  { id: 4, stars: 3, title: 'Creases easily', by: 'Paul W. · 14 Sep 2026 · Size M' },
  { id: 5, stars: 1, title: 'Colour faded after a month', by: 'Mia B. · 2 Sep 2026 · Size M' },
];
const only = ref<number | null>(null);
const shown = computed(() => reviews.filter((r) => !only.value || r.stars === only.value));
</script>

<template>
  <div class="reviews">
    <QReviewSummary
      :average="3.6"
      :distribution="{ 5: 2, 4: 1, 3: 1, 2: 0, 1: 1 }"
      filterable
      :active="only"
      @filter="only = $event"
    />
    <ul class="list" aria-label="Reviews">
      <li v-for="r in shown" :key="r.id" class="review">
        <QRating :value="r.stars" :show-value="false" size="small" />
        <strong>{{ r.title }}</strong>
        <span class="by">{{ r.by }} · Verified purchase</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.reviews {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
  gap: var(--space-8);
  align-items: start;
}
.list {
  display: grid;
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}
.review {
  display: grid;
  justify-items: start;
  gap: var(--space-1);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--line);
}
.by {
  font: var(--text-small);
  color: var(--ink-muted);
}
</style>
