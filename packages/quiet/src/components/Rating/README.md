# Rating

Stars for a product's average rating, with the number and the count: ★★★★☆ 4,3 (31). On product cards, under the product title (linking to the reviews), and on each review.

```vue
<QRating :value="4.3" :count="31" href="#reviews" />
<QRating :value="5" :show-value="false" size="small" />   <!-- one review -->
```

## Behaviour

- Five stars in `rating`; fractions fill part of a star (4.3 = four and a third).
- The number in label weight, the count in `ink-muted`. Read as one phrase: "Rated 4,3 out of 5, 31 reviews" — the stars themselves are hidden from screen readers.
- `href` makes it a link (24px+ target); the count underlines on hover.
- No reviews: "No reviews yet" (as a link it invites the first one).
- Sizes: `small` 13px stars (cards, review lists), default 16px.

## Rules

Stars are the one place an icon is filled. Show the count next to an average — 5,0 from one review is not 5,0 from 200. Round to one decimal.

## Related

RatingInput to give a rating, ReviewSummary for the breakdown.

## Keyboard and screen readers

Read as one phrase — "Rated 4,3 out of 5, 31 reviews"; the stars themselves are hidden. As a link it says the same.

## What you provide

The average (`value`) and `count`; `href` when it should lead to the reviews.
