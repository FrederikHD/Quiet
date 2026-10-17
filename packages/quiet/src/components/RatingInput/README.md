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

## Not for

Showing a rating — use Rating.

## Keyboard and screen readers

A radio group: Tab reaches the chosen star (or the first), ← → choose, each star is read as "4 stars, Very good". Errors are read with the group, like any field.

## Built from

The Field layout (label, marker, message) around native radios.

## What you provide

`v-model` (or `defaultValue`; a form reset goes back to it), `required` and the error when nothing is chosen.
