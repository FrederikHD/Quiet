# Metric

One number that matters, with how it moved: Sales · 4.280,00 € · ↑ 12 % on yesterday. The back office's home page, in Cards.

```vue
<QCard><QMetric label="Sales" :value="money(4280)" :change="{ direction: 'up', value: '12 %', label: 'on yesterday' }" /></QCard>
<QCard><QMetric label="Returns" value="4" good-when="down" :change="{ direction: 'down', value: '2', label: 'on last week' }" /></QCard>
```

## Anatomy

- Label in `small` `ink-muted`.
- The figure in `metric`: 28/32 semibold, tabular figures (20/28 with `size="small"`).
- The change in `small`: an arrow, the amount and what it's compared with. `success` when it's good, `danger` when it's bad, `ink-muted` when flat — good is "up" unless `goodWhen="down"` (returns, refunds, cancellations).
- Optional default slot under it: a link to the list behind the number ("View orders").

## Rules

- Never colour alone: the arrow and the words ("up 12 % on yesterday" for screen readers) carry the direction.
- Say what it's compared with. "↑ 12 %" alone means nothing.
- Lay several out in a grid of Cards, at least 200px each.

## Built from

Icon (the arrows).

## What you provide

The formatted figure (use `money()` for amounts) and the change you computed.
