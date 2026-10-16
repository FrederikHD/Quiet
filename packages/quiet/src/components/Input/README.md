# Input

A single-line text box — only the control itself; its label, help text and error message come from the Field component, which wraps it.

## Anatomy

An outer box (`surface-raised`, 1px `line-strong` border, `radius-md`) holding an optional `prefix`, the text field, an optional clear button and an optional `suffix`. The box fills its container's width — size it with the layout, not the input.

## Size and density

- `size="default"` follows the nearest `data-density`: 40px with 15px text in comfortable, 32px with 13px text in compact.
- `size="slim"` is a fixed 28px with 13px text: filter bars, inline edits in table cells. Back office and desktop only.
- `size="large"` is a fixed 48px with 16px text: storefront search, newsletter sign-up, checkout fields.
- Below 640px every input uses 16px text (iOS zooms into anything smaller) and slim takes the density size.
- Match the input to the buttons beside it: a compact filter bar uses compact or slim inputs with slim buttons.

## Prefix and suffix

- **Icons:** a search icon as `prefix` for search fields. Icons are sized to `--ctl-icon` and shown in `ink-muted`.
- **Units:** the currency where the shop's locale writes it — `suffix` "€" for German ("49,90 €"), `prefix` for English ("€49.90"), as `money()` formats it; "kg", "cm", "%" or "pcs" as `suffix`. A unit is decoration — the label must still say it ("Price in EUR", "Weight in kg"), because screen readers don't read affixes.
- Clicking an affix focuses the field.
- Keep affixes short; no buttons inside them. A visible action (Apply, Copy) goes next to the input as a Button.

## Numbers and prices

- Set `numeric` and `align="end"` for prices, quantities and stock counts so digits line up with the table columns they edit.
- Use `type="text"` with `inputMode="decimal"` (prices, weights) or `inputMode="numeric"` (quantities, postcodes) rather than `type="number"`: number fields drop leading zeros, change values on scroll and don't accept a German decimal comma. Native number spinners are hidden; a quantity stepper (− 1 +) is not in the system yet.

## Clear button

Pass `clearable` to show a × while the field has a value: search boxes, table filters, discount-code fields. It returns focus to the field. Translate `clear-label` ("Leeren"), or once for the shop with `configure({ strings: { input: { clear: 'Leeren' } } })`.

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

## What you provide

- A label: the Field component (preferred), or `id` with your own `<label for>`, or `aria-label` for fields that are labelled by their context (a table search above its table). The component warns in the console when there is none.
- `v-model`; `name`, `type`, `autocomplete`, `inputmode` as on a native input — `autocomplete` matters in checkout (`email`, `given-name`, `postal-code`, `cc-number`…).
- The component ref exposes `focus()` and `input` (the `<input>`); `class` and `style` go on the outer box.
