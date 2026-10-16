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
- **Label:** the control text size, 12px to the right of the box.
- **`description`** (optional): 13/18, `ink-muted`, under the label.
- **`meta`** (optional): right-aligned and tabular — a price or a count.
- **Row height:** as tall as a control (40px, 32px compact), and the whole row is the click target.
- **Long labels** wrap; the box stays on the first line.

## States

- **Unchecked / checked:** `v-model` (a boolean).
- **Indeterminate:** `indeterminate` shows a dash, meaning some but not all of the items it controls are ticked. Use it for "Select all" over a list or table rows. Clicking it ticks everything. Keep its `v-model` false alongside it.
- **Invalid:** `invalid` gives a red border until the box is ticked. Inside a CheckboxGroup, the group's `error` sets this for you and adds the message.
- **Disabled:** the box takes the disabled look of every control (`surface-sunken` fill, `line` border), the label `ink-muted`. Say why nearby.
- **Focus:** a 2px `brand` ring, 2px outside the box, from the keyboard only.
- **Card:** `card` turns the row into a bordered tile; ticked, it gets a `brand` border and `brand-tint`. Inside `<CheckboxGroup layout="cards">` this is set for you.

## Table rows

Use `<Table selectable>`: it adds the checkbox column, "Select all" with the indeterminate state, the highlighted rows, a bulk-action bar and "Select all 1,240", and names each box ("Select order #10421"). By hand, use `labelHidden` — it keeps the label for screen readers only, and the hit area stays at least 24px wide.

## Keyboard and screen readers

It's a native checkbox, so Space toggles it, Tab moves on, and clicking the label works. It's announced as "checkbox, checked/not checked/mixed" with its label and description.

## Writing it

- Phrase the label as the thing that happens when it's ticked, and keep it positive: "Send me the newsletter", not "Don't send me the newsletter".
- Never tick marketing consent by default.

## What you provide

- **Required:** `label`.
- **Optional:** `v-model`, `description`, `meta`, `indeterminate`, `invalid`, `disabled`, `labelHidden`, `card`, plus any native input attribute (`name`, `id`).
- **Inside a CheckboxGroup:** also `value`.
