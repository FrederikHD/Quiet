# QuantityStepper

A number of items: − [ 2 ] +. Used on the product page and in the cart, and anywhere a small whole number is set (stock adjustments).

```vue
<QField label="Quantity"><QQuantityStepper v-model="qty" :min="1" :max="10" /></QField>
<!-- cart line -->
<QQuantityStepper v-model="line.quantity" aria-label="Quantity of Linen shirt, navy" :min="0" />
```

## Behaviour

- **One control, one Tab stop:** the field is a spinbutton. ↑ ↓ change it by `step`, PageUp / PageDown by ten steps, Home / End jump to `min` / `max` (to the highest step at or below `max` when `max` isn't on the step grid: 9 for min 1, step 2, max 10).
- **Typing:** people can type a number. It's kept as typed and settled on Enter or when they leave the field: snapped to `step` and kept within `min`–`max`. Letters are ignored.
- **− and +:** for pointer and touch; they're skipped by Tab (the keyboard has the arrows) and turn grey at the limits.
- **`v-model` holds the number**, updated only when the value actually changes.
- **Cart lines:** `:min="0"` lets people go to zero; removing the line is up to you.

## Sizes

`default` follows the density (40px, compact 32px); `large` is 48px for the product page, next to Add to cart. On phones it's always 48px tall, with 48px buttons.

## In forms

Inside a Field it gets the field's label, hint and error (`invalid` shows the `danger` border). It resets with its Form, and posts its number under `name`.

## Keyboard and screen readers

- One Tab stop: a text field with `role="spinbutton"`, so screen readers announce its value, minimum and maximum. On phones it brings up the number keypad.
- ↑ ↓ change it by `step`, Page Up / Page Down by ten steps, Home / End jump to `min` / `max`. Typed numbers count on Enter or when leaving the field.
- − and + are for pointer and touch and are skipped by Tab; they are named "Decrease quantity" and "Increase quantity" and are disabled at the limits.
- Named by its Field's label (or `aria-label`) and described by the Field's message and hint. `invalid` (or a Field error) sets `aria-invalid`; a required Field adds `aria-required`.
- `readonly` keeps it in the tab order but ignores the keys, and disables − and +; `disabled` takes it out of the tab order.

## What you provide

- **Required:** a label (Field, or `aria-label` naming the product in a cart line).
- **Optional:** `min` (default 1), `max` (default 99), `step` (default 1), `size` (`default` | `large`; default `default`), `invalid`, `disabled`, `readonly`, `id` (inside a Field the Field's id wins). `name` and other attributes go to the native input.
- **v-model:** `v-model` (the number; starts at `min` when empty).
- **Translations:** `strings` — `decrease` ("Decrease quantity"), `increase` ("Increase quantity"); or `configure({ strings: { stepper: { … } } })`.

The component ref exposes `focus()` and `input` (the `<input>`); `class` and `style` go on the outer box.
