# Tag

A small label pill — usually one you can remove. It's the one chip in the system: the filters in use (FilterChips), applied discount codes (DiscountCode), and the chosen options inside a multi-select Combobox.

```vue
<QTag :swatch="navy" removable remove-label="Remove filter: Navy" @remove="remove('navy')">Navy</QTag>
<QTag icon="tag" detail="−10 %" removable @remove="removeCode">LINEN10</QTag>
```

## Variants

- **pill** (default): 32px tall (40px on phones), `line-strong` outline on `surface-raised`, `small` text. Removable pills are a single button with × at the end — the whole tag is the target.
- **field**: inside a multi-select field: compact, `surface-sunken`, `radius-sm`, with its own small × (a click on the field around it opens the list, so the tag itself can't be the button).

## Anatomy

An optional colour dot (`swatch`) or icon, the text (cut with "…" when long), an optional `detail` in `ink-muted`, then × when removable.

## Not a Badge

A Badge states a status and can't be acted on (Paid, Out of stock). A Tag is something the person chose and can take back.

## Keyboard and screen readers

Removable pills are buttons named "Remove <text>" (or `removeLabel`: "Remove filter: Navy"). After a removal, move focus somewhere sensible — FilterChips and DiscountCode do this for you.

## Built from

Icon.

## What you provide

The text, and `removable` (listen to `remove`) when it can be removed.
