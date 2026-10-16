# PriceRange

From–to filter for prices: a two-handle slider and two fields that say the exact amounts. In the shop's filters.

```vue
<QPriceRange v-model="range" :min="15" :max="115" :step="5" @commit="applyFilter" />
```

## Behaviour

- The slider is two native range inputs on one track ("Minimum price", "Maximum price", read as "30,00 €"), so arrow keys, Page Up/Down, Home/End, touch and screen readers work like any slider. The handles can't cross.
- The fields take typed amounts (comma or point) and commit on Enter or when you leave them, rounded to `step` and kept inside the range.
- `v-model` follows every move (update what the fields show); `commit` fires when a handle is let go or a field is committed — filter then, not on every pixel.
- Currency symbol from `configure({ locale, currency })`: "30 €" in German, "€30" in English.
- Handles are 20px (28px on touch screens, on a 44px tall track); track `line`, the chosen part `brand`.

## Not for

Choosing one number — use an Input with `numeric`, or QuantityStepper for counts.

## Keyboard and screen readers

Two sliders named "Minimum price" and "Maximum price", read as amounts ("30,00 €"): ← → move by `step`, Page Up/Down by more, Home/End to the ends. The fields are ordinary labelled text fields.

## Built from

FieldGroup with two Fields and Inputs; native range inputs for the handles.

## What you provide

`min`, `max` and `step` from your catalogue, the current `[from, to]` in `v-model`, and `@commit` to filter.
