# ReviewSummary

The head of a product's reviews: the average large, the stars, the count, and one bar per star level. Beside (or above, on phones) the list of reviews.

```vue
<QReviewSummary
  :average="4.3"
  :distribution="{ 5: 20, 4: 7, 3: 2, 2: 1, 1: 1 }"
  filterable
  :active="only"
  @filter="only = $event"
>
  <template #action><QButton @click="write">Write a review</QButton></template>
</QReviewSummary>
```

## Behaviour

- Average in 40px semibold with one decimal, 20px stars in `rating`, "31 reviews" in `ink-muted`. The count is the sum of `distribution` unless you pass `count`.
- Bars, 5 down to 1: level, a `rating` bar scaled to the most common level, the count.
- With `filterable` each row is a toggle button that emits `@filter` with the level, or null when pressed again to show all. Pass the level being filtered as `active`: that row is pressed and takes `brand-tint`. Levels with no reviews are disabled.
- The `#action` slot sits under the bars — usually "Write a review".

## Keyboard and screen readers

- The average is read as "4,3 out of 5"; the stars are hidden.
- The bars are a list named "Reviews by rating". The visible level, bar and count are hidden; each row is read as "20 reviews — 5 stars".
- With `filterable`, each row is a toggle button named by its (visually hidden) content, "5 stars, 20 reviews", with `aria-pressed` while active. Tab moves through the enabled rows; Enter or Space presses one. Levels without reviews are disabled.

## Built from

The stars of Rating.

## What you provide

The counts per level, the filtering and the review list itself (stars with Rating `small`, title, text, name · date · size bought, "Verified purchase").

- **Required:** `average` (0–5), `distribution` (`{ 5: 20, 4: 7, 3: 2, 2: 1, 1: 1 }`).
- **Optional:** `count` (default: the sum of `distribution`), `filterable`, `active` (the level being filtered on; default null).
- **Events:** `@filter(stars)` (the level pressed, or null to show all again).
- **Slots:** `#action` (under the bars: a "Write a review" Button).
- **Translations:** `strings`, or once for the shop with `configure({ strings: { reviewSummary: … } })`: `outOf` ("out of 5"), `reviews(n)` ("31 reviews"), `filter(stars, n)` ("5 stars, 20 reviews"), `bars` ("Reviews by rating").
