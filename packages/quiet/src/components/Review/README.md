# Review

One customer review: the stars, a title, who wrote it and when, what they bought, the text, and the shop's reply. List them beside a ReviewSummary on the product page.

```vue
<ul class="reviews" aria-label="Reviews">
  <li v-for="r in shown" :key="r.id">
    <QReview
      :rating="r.stars"
      :title="r.title"
      :author="r.author"
      :date="r.date"
      verified
      :details="[`Size ${r.size}`, r.colour]"
      :helpful="r.helpful"
      :voted="votes.has(r.id)"
      @vote="(on) => vote(r.id, on)"
    >
      <p>{{ r.text }}</p>
      <template v-if="r.reply" #reply><p>{{ r.reply }}</p></template>
    </QReview>
  </li>
</ul>
```

## Anatomy

1. **Stars:** 16px in `rating`, read as "Rated 4 out of 5".
2. **Title** (`title`): `heading` type, an `h3` under the reviews section's `h2` (`headingLevel` to change it).
3. **Meta line:** the author in `ink`, then the date and "Verified purchase" (`check-circle`, `success`) in 13px `ink-muted`, `space-3` apart. On a narrow screen whole items wrap to the next line.
4. **Details** (`details`): what they bought, "Size M · Navy", in 13px `ink-muted`. It helps people judge fit and colour.
5. **Text** (the default slot): up to 65 characters a line. After `lines` lines (default 5) it folds, with "Read more" under it, only when there is more to read.
6. **Reply** (`#reply`): the shop's answer, in its own block with a `line-strong` edge on `surface-sunken`, titled "Reply from the shop".
7. **Helpful** (`helpful`): a slim ghost toggle, "Helpful (3)", pressed when `voted`.

## Dates

Pass a `Date` and it shows as a long date in the configured locale ("October 12, 2026" in `en`, "12 October 2026" in `en-GB`, "12. Oktober 2026" in `de-DE`), with a `<time datetime="2026-10-12">` for machines. Pass a string to show your own text, such as "2 weeks ago".

## Writing it

- Show names the way customers chose to give them, shortened: "Anna S.".
- Only mark "Verified purchase" for reviews tied to an order.
- Keep the reply short and specific to the review. Thank them, and say what you changed or how to get help.
- Show reviews as written: don't edit their text. If you remove one, say why in your review policy.

## A list of reviews

A Review is one item; the list is yours to build:

- A `<ul aria-label="Reviews">` with each Review in an `li`, `space-6` apart with a `line` rule between them.
- Beside a ReviewSummary on wide screens, under it on phones. Its bars can filter the list.
- A Select to sort ("Most recent", "Highest rated", "Lowest rated", "Most helpful"), with "Showing 5 of 31" and a "Show more" button that moves focus to the first new review. Give each Review `tabindex="-1"` so it can take that focus; it stays out of the Tab order.
- With nothing to show: "No reviews with 2 stars yet."

The Product page pattern does all of this.

## Keyboard and screen readers

- Each review is an `article` named by its title, or "Review by Anna S." without one, so screen readers can list and jump between them.
- The stars are hidden; "Rated 4 out of 5" is read in their place.
- "Read more" is a button with `aria-expanded` and `aria-controls` pointing at the text. The folded text is still all there for screen readers.
- "Helpful (3)" is a toggle button with `aria-pressed`.

## Built from

The stars of Rating, Button, Icon.

## What you provide

- **Required:** `rating` (1–5), `author` ("Anna S.").
- **Optional:** `title`, `date` (a `Date` or text), `verified`, `details` (`['Size M', 'Navy']`), `lines` (default 5; 0 never folds), `helpful` (a count, shows the button), `voted`, `headingLevel` (2–6, default 3).
- **Events:** `@vote(voted)` — true to add the visitor's vote, false to take it back. Update `helpful` and `voted` yourself.
- **Slots:** the default slot (the text), `#reply` (the shop's reply).
- **Translations:** `strings`, or once for the shop with `configure({ strings: { review: … } })`: `rated(n)` ("Rated 4 out of 5"), `by(author)` ("Review by Anna S."), `verified` ("Verified purchase"), `readMore` ("Read more"), `readLess` ("Show less"), `helpful(n)` ("Helpful (3)"), `reply` ("Reply from the shop").
