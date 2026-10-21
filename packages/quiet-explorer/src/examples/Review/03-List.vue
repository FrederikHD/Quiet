<!-- A list of reviews with a sort order and "Helpful" votes. Each review is an article in a list; the votes are yours to keep. -->
<script setup lang="ts">
import { QReview, QSelect } from '@frederikhd/quiet';
import { computed, reactive, ref } from 'vue';

const reviews = reactive([
  {
    id: 1,
    rating: 5,
    title: 'Perfect for summer',
    author: 'Jonas W.',
    date: new Date(2026, 9, 3),
    helpful: 8,
    text: 'Cool on hot days and still smart enough for the office.',
  },
  {
    id: 2,
    rating: 4,
    title: 'Lovely, runs a little large',
    author: 'Lea F.',
    date: new Date(2026, 8, 28),
    helpful: 12,
    text: 'Soft from the first wash. I usually wear M and S fits me well.',
  },
  {
    id: 3,
    rating: 2,
    title: 'Too sheer in white',
    author: 'Mia B.',
    date: new Date(2026, 8, 2),
    helpful: 4,
    text: 'Nice fabric, but you need something under it. I sent it back for the blue one.',
  },
]);
const sort = ref('recent');
const shown = computed(() =>
  [...reviews].sort((a, b) =>
    sort.value === 'helpful' ? b.helpful - a.helpful : sort.value === 'low' ? a.rating - b.rating : +b.date - +a.date,
  ),
);
const votes = ref(new Set<number>());
function vote(id: number, on: boolean) {
  const r = reviews.find((x) => x.id === id)!;
  r.helpful += on ? 1 : -1;
  if (on) votes.value.add(id);
  else votes.value.delete(id);
}
</script>

<template>
  <div class="reviews">
    <QSelect
      v-model="sort"
      size="slim"
      aria-label="Sort reviews"
      class="sort"
      :options="[
        { value: 'recent', label: 'Most recent' },
        { value: 'helpful', label: 'Most helpful' },
        { value: 'low', label: 'Lowest rated' },
      ]"
    />
    <ul class="list" aria-label="Reviews">
      <li v-for="r in shown" :key="r.id">
        <QReview
          :rating="r.rating"
          :title="r.title"
          :author="r.author"
          :date="r.date"
          verified
          :helpful="r.helpful"
          :voted="votes.has(r.id)"
          @vote="(on) => vote(r.id, on)"
          >{{ r.text }}</QReview
        >
      </li>
    </ul>
  </div>
</template>

<style scoped>
.reviews {
  display: grid;
  gap: var(--space-4);
}
.sort {
  width: auto;
  justify-self: start;
}
.list {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}
.list > li {
  padding: var(--space-6) 0;
  border-bottom: 1px solid var(--line);
}
.list > li:first-child {
  padding-top: 0;
}
</style>
