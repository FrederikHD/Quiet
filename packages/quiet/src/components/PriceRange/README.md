# PriceRange

From–to filter for prices: a two-handle slider and two fields that say the exact amounts. In the shop's filters.

```vue
<QPriceRange v-model="range" :min="15" :max="115" :step="5" @commit="applyFilter" />
```

## Behaviour

- The slider is two native range inputs on one track ("Minimum price", "Maximum price", read as "30,00 €"), so arrow keys, Page Up/Down, Home/End, touch and screen readers work like any slider. The handles can't cross.
- The fields take typed amounts in the configured locale ("1.000,50" in German; comma or point for the decimals) and commit on Enter or when you leave them, rounded to `step` and kept inside the range.
- `v-model` follows every move (update what the fields show); `@commit` fires once when a moved handle is let go (pointer up, or the key released) or a typed price is committed — filter then, not on every pixel. Tabbing to a handle or clicking it without moving it doesn't commit.
- Currency symbol from `currency`, or from `configure({ locale, currency })`: "30 €" in German, "€30" in English. It shows inside the fields; the handles' spoken value is the formatted amount.
- `labelHidden` hides the "Price" label but keeps it as the group's name, for a filter panel whose heading already says "Price".
- `disabled` disables both handles and both fields.
- Handles are 20px (28px on touch screens, on a 44px tall track); track `line`, the chosen part `brand`.

## Not for

Choosing one number — use an Input with `numeric`, or QuantityStepper for counts.

## Keyboard and screen readers

- A group named by its label ("Price"), holding two native sliders named "Minimum price" and "Maximum price", read as amounts ("30,00 €"). ← → (and ↑ ↓) move by `step`, Page Up/Down by a larger amount the browser chooses, Home/End to the ends; a handle stops at the other one.
- Then two ordinary labelled text fields, "From" and "To", with the decimal keyboard on phones. What you type is a draft until Enter or leaving the field.

## Built from

FieldGroup with two Fields and Inputs; native range inputs for the handles.

## What you provide

- **Required:** `min` and `max` (the cheapest and dearest price in the list), and `v-model`.
- **Optional:** `step` (default 1), `label` (default "Price"), `labelHidden`, `currency` (ISO code; default the configured currency), `disabled`.
- **v-model:** `v-model` (`[from, to]`, updated on every move and every committed field).
- **Events:** `@commit([from, to])` — filter here.
- **Translations:** `strings`, or once with `configure({ strings: { priceRange: … } })` — `label` ("Price"), `from` ("From"), `to` ("To"), `minimum` ("Minimum price"), `maximum` ("Maximum price").
