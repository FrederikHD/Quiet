# QuantityStepper

A number of items: − [ 2 ] +. Used on the product page and in the cart, and anywhere a small whole number is set (stock adjustments).

```vue
<QField label="Quantity"><QQuantityStepper v-model="qty" :min="1" :max="10" /></QField>
<!-- cart line -->
<QQuantityStepper v-model="line.quantity" aria-label="Quantity of Linen shirt, navy" :min="0" />
```

## Behaviour

- **One control, one Tab stop:** the field is a spinbutton. ↑ ↓ change it by `step`, PageUp / PageDown by ten steps, Home / End jump to `min` / `max`.
- **Typing:** people can type a number. It's kept as typed and settled on Enter or when they leave the field: snapped to `step` and kept within `min`–`max`. Letters are ignored.
- **− and +:** for pointer and touch; they're skipped by Tab (the keyboard has the arrows) and turn grey at the limits.
- **`v-model` holds the number**, updated only when the value actually changes.
- **Cart lines:** `:min="0"` lets people go to zero; removing the line is up to you.

## Sizes

`default` follows the density (40px, compact 32px); `large` is 48px for the product page, next to Add to cart. On phones it's always 48px tall, with 48px buttons.

## In forms

Inside a Field it gets the field's label, hint and error (`invalid` shows the `danger` border). It resets with its Form, and posts its number under `name`.

## Keyboard and screen readers

One Tab stop: a spinbutton with its value, minimum and maximum. ↑ ↓ change it, Page Up/Down by 10, Home/End to the limits; typed numbers count on Enter or when leaving. − and + are for pointer and touch and are skipped by Tab.

## What you provide

A label (Field, or `aria-label` naming the product in a cart line), `v-model` (a number). Optional: `min` (default 1), `max` (default 99), `step`, `size`, `disabled`, `readOnly`, `name`, `strings` (`decrease`, `increase`; shop-wide under `strings.stepper`).
