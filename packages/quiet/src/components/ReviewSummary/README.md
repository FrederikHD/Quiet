# ReviewSummary

The head of a product's reviews: the average large, the stars, the count, and one bar per star level. Beside (or above, on phones) the list of reviews.

```vue
<QReviewSummary :average="4.3" :distribution="{ 5: 20, 4: 7, 3: 2, 2: 1, 1: 1 }" filterable :active="only" @filter="only = $event">
  <template #action><QButton @click="write">Write a review</QButton></template>
</QReviewSummary>
```

## Behaviour

- Average in 40px semibold, stars `rating`, "31 reviews" in `ink-muted`.
- Bars: level, a `rating` bar scaled to the most common level, the count. They're decorative to screen readers; each row is read as "20 reviews — 5 stars".
- With `filterable` each row is a toggle button (emitting `filter` with the level, or null) — "Show only 5-star reviews (20)", pressed while active (`brand-tint`); press again to show all. Levels with no reviews are disabled.
- `action` sits under the bars — usually "Write a review".

## Keyboard and screen readers

The average is read as "4,3 out of 5". With `filterable`, each bar is a toggle button ("Show only 5-star reviews (20)", pressed while active); levels without reviews are disabled.

## Built from

The stars of Rating.

## What you provide

The counts per level, the filtering and the review list itself (stars with Rating `small`, title, text, name · date · size bought, "Verified purchase").
