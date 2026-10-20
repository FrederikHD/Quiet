# Checkbox

One yes/no choice: a box people tick. It's the building block of CheckboxGroup and also works on its own — for "Select all", for a row in a table, or for a single statement people opt into.

## Checkbox or CheckboxGroup?

- **Checkbox** is the control itself: the box, its label and an optional description.
- **CheckboxGroup** is a form field that holds several checkboxes. It adds the field parts: the question label, help, hint and error messages, and label placement. Use it for any set of options ("Notify the customer by: Email, Text message").
- A **single checkbox in a form** ("I accept the terms", "Track inventory") also goes in a CheckboxGroup, but without a `label`. The group gives it the hint, the error message and the error-summary link. On its own, a Checkbox has no message slot.
- **Without a group:** "Select all" and filter toggles in a toolbar. Table rows get theirs from Table.

For exactly one of several options, use Radio in a RadioGroup. For something that takes effect immediately, use a switch (not built yet).

## Anatomy

- **Box:** 18px (16px compact), 1px `line-strong` border on `surface-raised`, `radius-sm`.
- **Ticked:** `brand` fill with a white tick.
- **Label:** the control text size, 12px to the right of the box (8px compact). Use the `#label` slot for rich content.
- **`description`** (optional): 13/18, `ink-muted`, under the label (or the `#description` slot).
- **`meta`** (optional): right-aligned and tabular — a price or a count (or the `#meta` slot).
- **Row height:** as tall as a control (40px, 32px compact), and the whole row is the click target.
- **Long labels** wrap; the box stays on the first line.

## States

- **Unchecked / checked:** `v-model` (a boolean).
- **Indeterminate:** `indeterminate` shows a dash, meaning some but not all of the items it controls are ticked. Use it for "Select all" over a list or table rows. Clicking it ticks everything. Keep its `v-model` false alongside it.
- **Invalid:** `invalid` gives a red border until the box is ticked. Inside a CheckboxGroup, the group's `error` sets this for you and adds the message.
- **Disabled:** the box takes the disabled look of every control (`surface-sunken` fill, `line` border; ticked, a `line-strong` fill), the label `ink-muted`. Say why nearby.
- **Focus:** a 2px `brand` ring, 2px outside the box, from the keyboard only.
- **Card:** `card` turns the row into a bordered tile; ticked, it gets a `brand` border and `brand-tint`. Inside `<CheckboxGroup layout="cards">` this is set for you.

## Swatches and size buttons

Inside `<QCheckboxGroup layout="swatches">` (colour filters) or `layout="buttons"` (sizes), each Checkbox shows as a tile instead of a row:

- `swatch` — the dot's colour, any CSS colour.
- `image` — a fabric picture (`{ src }`) instead of a colour.
- `soldOut` — crossed out, but still choosable, so "Notify me" can follow. Screen readers hear "sold out" after the label.

Tiles use the `label` and `description` props; the slots and `meta` don't show there.

## Table rows

Use `<Table selectable>`: it adds the checkbox column, "Select all" with the indeterminate state, the highlighted rows, a bulk-action bar and "Select all 1,240", and names each box ("Select order #10421"). By hand, use `labelHidden` — it keeps the label for screen readers only, and the hit area stays at least 24px wide.

## Keyboard and screen readers

- It's a native checkbox, so Space toggles it, Tab moves on, and clicking anywhere on the row works.
- It's announced as "checkbox, checked/not checked/mixed". The whole row is its `<label>`, so its name is the label followed by the description and meta.
- `invalid` (or the group's error) sets `aria-invalid`. Inside a CheckboxGroup it is also described by the group's message and hint; a lone Checkbox wrapped in a Field gets the Field's id, description, `aria-required` and disabled state.
- The focus ring shows only for keyboard focus.

## Writing it

- Phrase the label as the thing that happens when it's ticked, and keep it positive: "Send me the newsletter", not "Don't send me the newsletter".
- Never tick marketing consent by default.

## What you provide

- **Required:** `label` (or the `#label` slot, or `aria-label`).
- **Optional:** `description`, `meta`, `indeterminate`, `invalid`, `disabled`, `labelHidden`, `card`, `name` (inside a CheckboxGroup the group's name is used), `id`, and any native input attribute.
- **Inside a CheckboxGroup:** `value` (identifies the option in the group's array); with `layout="swatches"` or `"buttons"` also `swatch`, `image`, `soldOut`.
- **v-model:** `v-model` (a boolean, on its own; inside a CheckboxGroup the group holds the value).
- **Slots:** `#label`, `#description`, `#meta`.

The component ref exposes `focus()` and `input` (the `<input>`); `class` and `style` go on the row.
