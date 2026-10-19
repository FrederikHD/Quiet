# Metric

One number that matters, with how it moved: Sales · 4.280,00 € · ↑ 12 % on yesterday. The back office's home page, in Cards.

```vue
<QCard><QMetric label="Sales" :value="money(4280)" :change="{ direction: 'up', value: '12 %', label: 'on yesterday' }" /></QCard>
<QCard><QMetric label="Returns" value="4" good-when="down" :change="{ direction: 'down', value: '2', label: 'on last week' }" /></QCard>
```

## Anatomy

- Label in `small` `ink-muted` (the `label` prop, or the `#label` slot).
- The figure in `metric`: 28/32 semibold, tabular figures (20/28 with `size="small"`). Pass it already formatted in `value`, or rich content in the `#value` slot.
- The change in `small`: an arrow, the amount and what it's compared with. `success` when it's good, `danger` when it's bad, `ink-muted` and no arrow when it's `same` — good is "up" unless `goodWhen` is `down` (returns, refunds, cancellations).
- Optional default slot under it: a link to the list behind the number ("View orders").

## Rules

- Never colour alone: the arrow and the words ("up 12 % on yesterday" for screen readers) carry the direction.
- Say what it's compared with. "↑ 12 %" alone means nothing.
- Lay several out in a grid of Cards, at least 200px each.

## Keyboard and screen readers

Nothing to operate except a link you put in the default slot. The arrow is decorative; a visually hidden word before the change carries the direction, so the change reads "up 12 % on yesterday", "down 2 on last week" or "no change on yesterday". The colour adds nothing a screen reader needs.

## Built from

Icon (the arrows).

## What you provide

- **Required:** `label` ("Sales"), `value` (already formatted; use `money()` for amounts).
- **Optional:** `change` (`{ direction: 'up' | 'down' | 'same', value?, label? }`, the change you computed), `goodWhen` (`up` | `down`; default `up`), `size` (`default` | `small`; default `default`).
- **Slots:** `#label` (a rich label), `#value` (a rich figure), the default slot (under the change: a link to the list behind the number).
- **Translations:** `strings`, or once for the shop with `configure({ strings: { metric: … } })`: `up` ("up"), `down` ("down"), `same` ("no change").
