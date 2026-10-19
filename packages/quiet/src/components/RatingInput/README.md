# RatingInput

Five stars to give a rating — in the "Write a review" form.

```vue
<QRatingInput id="rv-rating" v-model="stars" label="Your rating" required :error="tried && !stars ? 'Choose from 1 to 5 stars' : null" />
```

## Behaviour

- A radio group underneath ("1 star, Poor" … "5 stars, Excellent"): ← → choose, Tab leaves, forms post `name`. Focus shows on the star.
- Hover previews the stars up to the pointer and the word for the level ("Very good") next to them.
- 28px stars in 40px targets (32px in 48px on phones). Empty stars `line-strong`; chosen ones filled `rating`; with an error the empty stars turn `danger` and the message sits under them like any field's.
- Works with the Form's error summary: `id` lands on the chosen star (or the first), so "Choose from 1 to 5 stars" jumps there.
- The label always sits above the stars, whatever the Form's label placement. `markers` overrides the Form's required or optional marker, as on Field.
- `hint` shows under the stars. `disabled` greys the stars and stops hover and choosing.
- The value is 1–5, or 0 for none yet (also after a form reset without `defaultValue`).

## Not for

Showing a rating — use Rating.

## Keyboard and screen readers

- A `radiogroup` named by the label ("Your rating"), with `aria-required` when `required` and `aria-invalid` while it has an `error`.
- Five native radios: Tab reaches the chosen star (or the first) and leaves the set in one step; ← → ↑ ↓ move and choose. Each star is read as "4 stars, Very good".
- The hint and the message are tied to every star. The message is a polite live region, quiet while the Form's error summary is showing.
- The word beside the stars repeats what is already read, so it is hidden from screen readers.
- `required` also sets the native `required`, so a plain form post is blocked without a rating.

## Built from

The Field layout (label, marker, message) around native radios.

## What you provide

- **Optional:** `label` (default "Your rating"), `required`, `error`, `hint`, `id` (lands on the chosen star, or the first), `name` (generated when missing), `disabled`, `markers` (`required` | `optional` | `none`, default the Form's), `defaultValue` (starts the value without v-model; a form reset goes back to it).
- **v-model:** `v-model` (1–5, or 0 for none yet).
- **Translations:** `strings`, or once with `configure({ strings: { rating: … } })` — `yours` ("Your rating"), `stars(n)` ("4 stars"), `words` (["Poor", "Fair", "Good", "Very good", "Excellent"]). The same `strings` also takes the Form keys `optional` ("optional") and `errorPrefix` ("Error:"), which otherwise come from the Form or `configure({ strings: { form: … } })`.
