# DescriptionList

Pairs of labels and values: a product's details, a customer's contact data, an order's totals. It's a real `<dl>`, so screen readers announce each term with its value.

## Layouts (`layout`)

- **`columns`** (default): the term on the left (12rem, or `termWidth`) and the value beside it, once the list is 480px wide; stacked below that. Use it for details on a page.
- **`inline`:** the term on the left and the value pushed to the right, on one line. Use it for totals and short facts in narrow cards. An `emphasis` item (the total) gets a rule above it and semibold type.
- **`stacked`:** the term (13/18 `ink-muted`) above the value. Use it for narrow side columns.

`dividers` adds a `line` rule between items.

## Items

`{ term, description, numeric, emphasis, key }`:

- **`numeric`:** tabular figures, so amounts line up.
- **`emphasis`:** marks the item that sums the others up.
- **Empty values:** shown as "—" (or `emptyText`), never as a blank gap.

## When to use

- **DescriptionList:** facts people read.
- **Field:** facts people edit.
- **Table:** many records with the same fields.

## What you provide

- **Required:** `items`.
- **Optional:** `layout`, `dividers`, `term-width`, `empty-text`, `class`. Rich content for an item goes in the `#term-<key>` / `#description-<key>` slots.
