<!-- With filterable each bar is a toggle that shows only those reviews, listed with Review; press it again to show all. Levels without reviews are disabled. -->
<script setup lang="ts">
import { QReview, QReviewSummary } from '@frederikhd/quiet';
import { computed, ref } from 'vue';

const reviews = [
  { id: 1, stars: 5, title: 'Soft from the first wash', author: 'Anna S.', date: '12 Oct 2026', size: 'M' },
  { id: 2, stars: 5, title: 'Perfect for summer', author: 'Jonas W.', date: '3 Oct 2026', size: 'L' },
  { id: 3, stars: 4, title: 'Lovely, runs a little large', author: 'Lea F.', date: '28 Sep 2026', size: 'S' },
  { id: 4, stars: 3, title: 'Creases easily', author: 'Paul W.', date: '14 Sep 2026', size: 'M' },
  { id: 5, stars: 1, title: 'Colour faded after a month', author: 'Mia B.', date: '2 Sep 2026', size: 'M' },
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
      <li v-for="r in shown" :key="r.id">
        <QReview
          :rating="r.stars"
          :title="r.title"
          :author="r.author"
          :date="r.date"
          verified
          :details="[`Size ${r.size}`]"
        />
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
  margin: 0;
  padding: 0;
  list-style: none;
}
.list > li {
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--line);
}
.list > li:first-child {
  padding-top: 0;
}
</style>
