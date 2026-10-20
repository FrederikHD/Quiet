# Rating

Stars for a product's average rating, with the number and the count: ★★★★☆ 4,3 (31). On product cards and under the product title, linking to the reviews. A single customer's review is a Review, which draws its own stars.

```vue
<QRating :value="4.3" :count="31" href="#reviews" />
<QRating :value="4.6" :show-value="false" size="small" />
<!-- stars only, in a tight row -->
<QRating :value="4.3" :count="31" @click="tab = 'reviews'" />
<!-- opens the reviews tab -->
```

## Behaviour

- Five stars in `rating`; fractions fill part of a star (4.3 = four and a third).
- The number, with one decimal and in semibold, then the count "(31)" in `ink-muted`. `:show-value="false"` hides the number; leave out `count` to hide the count.
- `href` makes it a link (24px+ target); the count underlines on hover. `@click` alone makes it a link too (`href="#"`, not followed), to open the reviews tab on the same page. With `href`, `@click` is called and the link followed.
- No reviews (`value` and `count` both 0 or missing): "No reviews yet" (as a link it invites the first one).
- Sizes: `small` 13px stars with 12px text (product cards, table rows), `default` 16px stars with 13px text, `large` 20px stars with 15px text (beside a large product title).

## Rules

Stars are the one place an icon is filled. Show the count next to an average — 5,0 from one review is not 5,0 from 200. The number is rounded to one decimal for you; pass the exact average.

## Related

RatingInput to give a rating, ReviewSummary for the breakdown, Review for one customer's review.

## Keyboard and screen readers

- Read as one phrase from visually hidden text: "Rated 4,3 out of 5, 31 reviews" (without a count, "Rated 4,3 out of 5"). The stars, the number and "(31)" are hidden from screen readers.
- As a link (`href` or `@click`) it's one Tab stop and says the same; Enter follows it or calls `@click`.

## What you provide

- **Required:** `value` (the average, 0–5).
- **Optional:** `count` (number of reviews), `href` (to the reviews), `showValue` (default true), `size` (`small` | `default` | `large`; default `default`).
- **Events:** `@click(event)` (makes it a link that isn't followed; declared as the `onClick` prop).
- **Translations:** `strings`, or once for the shop with `configure({ strings: { rating: … } })`: `label(value, count)` ("Rated 4,3 out of 5, 31 reviews"), `none` ("No reviews yet"), `count(n)` ("(31)"). The same namespace holds RatingInput's `stars`, `words` and `yours`.
