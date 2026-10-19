# Tag

A small label pill — usually one you can remove. It's the one chip in the system: the filters in use (FilterChips), applied discount codes (DiscountCode), and the chosen options inside a multi-select Combobox.

```vue
<QTag :swatch="navy" removable remove-label="Remove filter: Navy" @remove="remove('navy')">Navy</QTag>
<QTag icon="tag" detail="−10 %" removable @remove="removeCode">LINEN10</QTag>
```

## Variants

- **pill** (default): 32px tall (40px on phones), `line-strong` outline on `surface-raised`, 13px text. Removable pills are a single button with × at the end — the whole tag is the target.
- **field** (`variant="field"`): inside a multi-select field: compact, `surface-sunken`, `radius-sm`, with its own small × (a click on the field around it opens the list, so the tag itself can't be the button).

`disabled` means it can't be removed: a disabled pill is dimmed (a removable one becomes a disabled button), and a field tag loses its ×.

## Anatomy

An optional 12px colour dot (`swatch`, any CSS colour) or 16px icon in the brand colour, the text (cut with "…" when long), an optional `detail` in `ink-muted` (or the `#detail` slot), then × when removable.

## Not a Badge

A Badge states a status and can't be acted on (Paid, Out of stock). A Tag is something the person chose and can take back.

## Keyboard and screen readers

Removable pills are buttons named "Remove <text>" (or `removeLabel`: "Remove filter: Navy"); Enter or Space removes. A field tag's × is a separate button with the same name, without the detail. The whole pill is the button, so its name always holds what it shows: a `detail` is added to the end ("Remove discount LINEN10 −10 %"), and a `removeLabel` should contain the tag's text — people using voice control say what they see. After a removal, move focus somewhere sensible — FilterChips and DiscountCode do this for you.

## Built from

Icon.

## What you provide

- **Required:** the text ("Navy"), in the default slot.
- **Optional:** `removable` (emits `@remove`), `removeLabel` (default "Remove <text>"), `variant` (`pill` | `field`, default `pill`), `swatch` (a colour dot), `icon`, `detail` (after the text: "−10 %"), `disabled` (can't be removed).
- **Events:** `@remove` (the pill, or its ×, was pressed).
- **Slots:** the default slot (the text), `#detail` (in place of `detail`).
- **Translations:** `strings` — `remove`, a function of the tag's text (default "Remove <text>"); or once for the shop with `configure({ strings: { tag: { remove: (label) => … } } })`.
