# FieldGroup

Puts several Fields side by side — First name | Last name, Postcode | City, Length × Width × Height — and stacks them when there isn't room.

## When to group

- The fields are parts of one answer (an address line, dimensions, a date range) or are always compared (Price | Compare-at price).
- Each part is short. Never put two long, unrelated fields side by side just to save space — people miss the second one.
- At most three or four fields in a row.

## Columns

`columns` sets relative widths: `[1, 1]` equal (default), `[1, 2]` Postcode | City, `[3, 1]` Street | House number.

The group measures itself and stacks into one column, in source order, as soon as its **narrowest** field would drop under about 100px — so on a phone First | Last name and Postcode | City stay side by side, while Street | House number stacks. Order the children so they read well stacked. Set `stack="late"` for rows of short values — Length × Width × Height in cm, Hours : Minutes: they stay a row down to about 88px per field, with tighter padding.

## Connected

`connected` joins the controls into one: no gap, a single shared border, only the outer corners rounded. Use it when the parts make one value — Prefix | Next number, Country code | Phone number, Amount | Currency — and set the split with `columns` (`[1, 3]` for a quarter and three quarters).

- Each part keeps its own Field and label, so screen readers name every input. With a group `label` that says it all ("Phone"), hide the part labels with `labelHidden`.
- Put the required marker on the group, not on each part; avoid "(optional)" on narrow parts.
- The hovered, focused or invalid part is drawn on top, so its border and focus ring are never covered by a neighbour. A part with an error shows its message under that part; a problem with the combination goes on the group.
- Connected rows keep the split while there is room; when there isn't, each part keeps a floor (72px for an input; for a select, the width of its longest option plus the chevron, measured) and the larger parts give way, so the control stays joined on any phone. Only below about 80px per part in total do the parts come apart and stack.
- Only for parts that belong together. Two unrelated values side by side stay separate.

## Group label

- With `label` the group gets a heading and is announced as a group ("Dimensions, group"). The label follows the same placement rules as a Field — beside the row when there's room, above it on phones — and lines up with the fields' own labels.
- Without `label` it's purely a layout row; in side placement it still lines up with the other fields' controls.
- The fields inside always put their labels on top. Keep them short: "Length", "Width", "Height".

## Group messages

`error`, `warning`, `success`, `hint` and `help` work as on Field, for things that belong to the whole group: "End date must be after the start date", "All three dimensions are needed to calculate shipping". A problem with one field goes on that Field. A group `error` marks every field in it invalid, and its message and hint are read with each field, so screen-reader users hear it wherever they are in the group. Give the group an `id` to link it from the Form's error summary — the link lands on the first field.

## Disabled

`disabled` disables every field in the group, as if each Field had it.

## What you provide

Two or more Fields in the default slot; optionally `label`, `columns`, `required`, `hint`, `help` and a message.
