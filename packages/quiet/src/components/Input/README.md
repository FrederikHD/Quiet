# Input

A single-line text box — only the control itself; its label, help text and error message come from the Field component, which wraps it.

## Anatomy

An outer box (`surface-raised`, 1px `line-strong` border, `radius-md`) holding an optional prefix, the text field, an optional clear button and an optional suffix. The box fills its container's width — size it with the layout, not the input.

## Size and density

- `size="default"` follows the nearest `data-density`: 40px with 15px text in comfortable, 32px with 13px text in compact.
- `size="slim"` is a fixed 28px with 13px text: filter bars, inline edits in table cells. Back office and desktop only.
- `size="large"` is a fixed 48px with 16px text: storefront search, newsletter sign-up, checkout fields.
- Below 640px every input uses 16px text (iOS zooms into anything smaller) and slim takes the density size.
- Match the input to the buttons beside it: a compact filter bar uses compact or slim inputs with slim buttons.

## Prefix and suffix

- `prefix` and `suffix` take text; the `#prefix` and `#suffix` slots take anything else.
- **Icons:** a search icon in the `#prefix` slot for search fields. Icons are sized to `--ctl-icon` and shown in `ink-muted`.
- **Units:** the currency where the shop's locale writes it — `suffix` "€" for German ("49,90 €"), `prefix` for English ("€49.90"), as `money()` formats it; "kg", "cm", "%" or "pcs" as `suffix`. A unit is decoration — the label must still say it ("Price in EUR", "Weight in kg"), because affixes aren't part of the field's name or description and screen readers don't read them with the field.
- Clicking an affix focuses the field.
- Keep affixes short; no buttons inside them. A visible action (Apply, Copy) goes next to the input as a Button.

## Numbers and prices

- Set `numeric` and `align="end"` for prices, quantities and stock counts so digits line up with the table columns they edit.
- Use `type="text"` with `inputmode="decimal"` (prices, weights) or `inputmode="numeric"` (quantities, postcodes) rather than `type="number"`: number fields drop leading zeros, change values on scroll and don't accept a German decimal comma. Native number spinners are hidden; for − 1 + buttons use QuantityStepper.
- `v-model.number` gives a number for any numeric text, and `v-model.trim` trims the value.

## Clear button

Pass `clearable` to show a × while the field has a value: search boxes, table filters, discount-code fields. Pressing it empties the value, emits `@clear` and returns focus to the field. It doesn't show while the input is disabled or read-only. Translate `clearLabel` ("Leeren"), or once for the shop with `configure({ strings: { input: { clear: 'Leeren' } } })`.

## States

- **Hover:** border darkens to `ink-muted`.
- **Focus:** the border thickens from 1px to 2px, drawn inward so nothing shifts, in `brand`. No ring outside the field — it stays tight, and in connected groups it never spills onto the next part. In Windows high-contrast mode a system-coloured ring appears instead.
- **Invalid:** `invalid` turns the border `danger` and sets `aria-invalid`. Focused, it stays `danger` and thickens to 2px: focus is shown by thickness, the error by colour, so the error stays visible while it's being fixed. Never use it without the Field component's error message — a red border alone tells a colour-blind person nothing.
- **Read-only:** `readonly` gives a `surface-sunken` fill and `line` border; the value stays selectable and copyable, and it takes the same 2px `brand` border when focused. Use it for order numbers, generated SKUs, API keys.
- **Disabled:** `surface-sunken` fill, `line` border, `ink-muted` text — the same disabled look as every other control. Prefer read-only when people still need to read or copy the value.
- **Autofill:** browser autofill keeps `surface-raised` and `ink` instead of the browser's yellow or blue.
- **High contrast (Windows):** borders use system colours; invalid gets a 2px dashed border so it isn't colour-only.

## Placeholders

A placeholder is an example, never the label: "z. B. 1049" for an order number, "name@example.com" for email. It disappears when typing starts, so nothing essential goes in it.

## Keyboard and screen readers

- A native `<input>`: typing, selection and Tab work as usual. Clicking the padding or an affix focuses it.
- The input is named by its Field's label and described by the Field's message and hint (`aria-describedby`, added to any you pass). `invalid`, or an error on the Field, sets `aria-invalid`; `required` sets the native `required`, and a required Field adds `aria-required`.
- The clear button is a separate tab stop after the input, named "Clear" (`clearLabel`). Enter or Space clears and puts focus back in the input.
- Read-only inputs stay in the tab order and their text can be selected; disabled ones are skipped.

## What you provide

- A label: the Field component (preferred), or `id` with your own `<label for>`, or `aria-label` for fields that are labelled by their context (a table search above its table). The component warns in the console when there is none.
- **Optional:** `size` (`slim` | `default` | `large`; default `default`), `prefix`, `suffix`, `align` (`start` | `end`; default `start`), `numeric`, `clearable`, `clearLabel` (default "Clear"), `invalid`, `disabled`, `readonly`, `required`, `id`, `type` (default "text"). `name`, `autocomplete`, `inputmode`, `placeholder` and other attributes go to the native input — `autocomplete` matters in checkout (`email`, `given-name`, `postal-code`, `cc-number`…).
- **v-model:** `v-model` (the text; `.trim` and `.number` work).
- **Events:** `@clear` (the clear button was pressed; the value is already empty).
- **Slots:** `#prefix`, `#suffix`.
- **Translations:** `clearLabel`, or `configure({ strings: { input: { clear: 'Leeren' } } })`.

The component ref exposes `focus()` and `input` (the `<input>`); `class` and `style` go on the outer box.
