# Radio

One option in a set where exactly one can be chosen. A Radio always sits inside a RadioGroup: the group names the question, holds the value and makes the arrow keys move between the options.

## Radio or RadioGroup?

- **Radio** is a single option: the circle, its label, and an optional description and price.
- **RadioGroup** is the form field around the options: the question ("Delivery"), the chosen value, the layout, and the hint and error messages.
- Always use both. A Radio outside a RadioGroup logs a console warning.

## Anatomy

- **Circle:** 18px (16px compact), 1px `line-strong` border on `surface-raised`.
- **Chosen:** `brand` fill with a `surface-raised` centre.
- **Label:** the control text size, 12px to the right (8px compact).
- **`description`** (optional): 13/18, `ink-muted`.
- **`meta`** (optional): right-aligned and tabular, usually the price ("Free", "9,90 €").
- **Row height:** as tall as a control (40px, 32px compact), and the whole row is the click target.

## States

- **Not chosen / chosen:** set by the group's value.
- **Disabled:** `disabled` on one option, or on the whole group. Put the reason in the `description` ("Has open orders").
- **Invalid:** when the group has an `error`, unchosen circles (or unchosen cards) turn `danger` until one is chosen. `invalid` on one Radio does the same for that option alone.
- **Focus:** a 2px `brand` ring 2px outside the circle, or around the whole card. It is `danger` while the group has an error.
- **Card:** inside `<QRadioGroup layout="cards">`, each option is a bordered tile; the chosen one gets a `brand` border and `brand-tint`. `card` (or `:card="false"`) on one Radio overrides the group's layout for that option.
- **Swatch or size tile:** inside a `swatches` or `buttons` group, the option shows as a colour dot or a size tile instead of a row. Only `label`, `description`, `swatch`, `image`, `soldOut` and `disabled` apply there; `meta` and the slots are not shown.

## Keyboard and screen readers

Native radios:

- Tab enters the set on the chosen option, or the first one, and leaves it in one step.
- ↑ ↓ ← → move and choose, skipping disabled options.
- In a row or card, the whole row is the `<label>`, so the label, the description and `meta` together name the option; the group's hint and message are tied to it as its description. Each option is read as "Express, Next working day, 9,90 €, radio button, 2 of 3".
- Keep `meta` short (a price, a count): it is read as part of every option's name.
- A swatch or size tile is read as "XL, sold out" (plus its description); its dot or face is hidden from screen readers.
- `media` pictures are hidden from screen readers.

## Card pictures

In a `layout="cards"` group, `media` shows a small picture before the label — the card or invoice icon of a payment method, or a carrier logo. It is hidden from screen readers, so the label must still say what the option is.

## Custom content

The `#label`, `#description` and `#meta` slots take rich content in place of the props, for example a Badge after the label. `#media` is the card picture described above.

```vue
<QRadio value="klarna" description="Pay in 30 days">
  <template #label>Invoice <QBadge tone="success">New</QBadge></template>
  <template #media><QIcon name="mail" /></template>
</QRadio>
```

## What you provide

- **Required:** `value` (the group's value when this option is chosen), and `label` ("Express") or the `#label` slot.
- **Optional:** `description`, `meta` ("9,90 €"), `disabled`, `invalid` (default from the group's `error`), `card` (default from the group's `cards` layout), `id` (on the native input; the group's `id` already lands on the chosen or first option).
- **In a `swatches` or `buttons` group:** `swatch` (a CSS colour) or `image` (a fabric picture, `{ src }`) for the dot, and `soldOut`.
- **Slots:** `#label`, `#description`, `#meta`, `#media` (cards: a small decorative picture before the text).
- **Translations:** the "sold out" word, once with `configure({ strings: { choice: { soldOut: 'ausverkauft' } } })`.
