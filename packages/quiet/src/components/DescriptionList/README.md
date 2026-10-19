# DescriptionList

Pairs of labels and values: a product's details, a customer's contact data, an order's totals. It's a real `<dl>`, so screen readers announce each term with its value.

## Layouts (`layout`)

- **`columns`** (default): the term on the left (12rem, or `termWidth`) and the value beside it, once the list is 480px wide; stacked below that. Use it for details on a page.
- **`inline`:** the term on the left and the value pushed to the right, on one line. Use it for totals and short facts in narrow cards. An `emphasis` item (the total) gets a rule above it, and its term and value turn semibold.
- **`stacked`:** the term (13/18 `ink-muted`) above the value (15/22). Use it for narrow side columns.

`dividers` adds a `line` rule between items.

## Items

`items` is a list of `{ term, description, numeric, emphasis, key }`. Falsy entries are skipped, so an item can be added conditionally.

```vue
<QDescriptionList
  :items="[
    { term: 'SKU', description: 'LS-NAVY-M' },
    { term: 'Weight', description: weight },
    { key: 'status', term: 'Status' },
  ]"
>
  <template #description-status><QBadge tone="success">Active</QBadge></template>
</QDescriptionList>
```

- **`key`:** names the item's slots, `#term-<key>` and `#description-<key>` (both get `{ item }`). Without a key, the item's index is used (`#description-2`).

- **`numeric`:** tabular figures, so amounts line up.
- **`emphasis`:** marks the item that sums the others up: its value turns semibold (and in `inline`, see above).
- **Empty values** (`null`, `undefined` or `''`): shown as "—" in `ink-muted` (or `emptyText`), never as a blank gap. A `#description-<key>` slot replaces this.

## When to use

- **DescriptionList:** facts people read.
- **Field:** facts people edit.
- **Table:** many records with the same fields.

## Keyboard and screen readers

Nothing to operate: it's a `<dl>` with a `<dt>` and `<dd>` per item, so screen readers announce each term with its value. Links you put in a slot are reached with Tab as usual.

## What you provide

- **Required:** `items` (`{ term, description, numeric, emphasis, key }`).
- **Optional:** `layout` (`columns` | `inline` | `stacked`; default `columns`), `dividers`, `termWidth` (`columns` layout; default 12rem), `emptyText` (default "—").
- **Slots:** `#term-<key>="{ item }"`, `#description-<key>="{ item }"` (the item's key, or its index).
