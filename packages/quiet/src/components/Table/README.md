# Table

Back-office lists: orders, products, customers, refunds. It's a real `<table>` and adds:

- **Sorting** by column.
- **Row selection** with a bulk-action bar and "Select all 1,240".
- **Rows that open** when clicked.
- **Row actions**, loading and empty states.
- **Phone layouts:** a sideways scroll with the first column pinned, or one card per row.

```vue
<QTable
  caption="Orders"
  :columns="[
    { key: 'number', header: 'Order' },
    { key: 'customer', header: 'Customer', sortable: true },
    { key: 'status', header: 'Status' },
    { key: 'total', header: 'Total', numeric: true, sortable: true, format: (row) => money(row.total) },
  ]"
  :rows="orders"
  selectable
  v-model:selected="selected"
  :row-href="(row) => `/orders/${row.id}`"
>
  <template #cell-status="{ row }"><QBadge :tone="row.tone">{{ row.status }}</QBadge></template>
  <template #bulk-actions="{ selected }"><QButton size="slim" @click="archive(selected)">Archive</QButton></template>
  <template #footer><QPagination v-model:page="page" :total="1240" /></template>
</QTable>
```

## When to use

- **Table:** records people scan, compare, sort and act on — the same fields for every row.
- **Not for layout,** and not for one record's details. Use a DescriptionList or a form for those.
- **Storefront:** product grids are cards, not tables. Tables in the shop are for order history and size charts.

## Anatomy

- **Frame:** `surface-raised`, a `line` border, `radius-lg`.
- **Caption** on top (17/24 semibold): it names the table. `captionHidden` hides it visually when a heading above already says it; the `#caption` slot takes rich content.
- **Optional toolbar** (`#toolbar`): search Input and filter Selects, all `size="slim"`.
- **Header row:** `surface-sunken`, `label` type (13/16 medium) in `ink-muted`; the sorted column turns `ink`.
- **Body rows:** `--row-h` tall (56px comfortable, 40px compact), `--cell-pad-x` / `--cell-pad-y` padding, `--cell-text`, and `line` rules between rows.
- **Primary column:** the row's name (order number, product name), the first column unless another has `primary`. It's the row header, in medium weight.
- **Numbers** (`numeric`): right-aligned with tabular figures, header included.
- **Optional footer** (`#footer`): usually a Pagination.

## Columns

`columns` is a list of `{ key, header, … }`. Falsy entries are skipped, so a column can be added conditionally.

| Field                                     | What it does                                                                                                                                      |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`                                     | Field name in the row, the sort key, and the slot names `#cell-<key>` and `#header-<key>`.                                                        |
| `header`                                  | Header text (rich headers: the `#header-<key>` slot). Also the label in phone cards.                                                              |
| `format(row, index)`                      | Plain text for the cell; default `row[key]`. For rich cells (a Badge for statuses) use the `#cell-<key>` slot.                                    |
| `numeric`                                 | Right-aligned, tabular figures; sorts high to low first.                                                                                          |
| `align`                                   | `start` (default) / `end` / `center`.                                                                                                             |
| `sortable`, `sortValue(row)`, `sortFirst` | Make it sortable; the value to sort by (default `row[key]`); the first direction, `asc` or `desc`.                                                |
| `sortLabels`                              | Phone sort menu wording, `[ascending, descending]`, e.g. `['Oldest first', 'Newest first']`. Default "Total, ascending" / "Total, descending".    |
| `primary`                                 | The column that names the row (default: the first).                                                                                               |
| `truncate`                                | One line with an ellipsis: `true` (18rem) or a CSS length. The full text shows on hover (native title, plain-text cells only) and in phone cards. |
| `wrap`                                    | Let long text wrap (12rem minimum).                                                                                                               |
| `width`, `minWidth`                       | Column width, as CSS lengths.                                                                                                                     |
| `mobile: false`                           | Hide this column in phone cards.                                                                                                                  |

## Sorting

- Click a sortable header to sort; click again to reverse. The first click sorts `numeric` columns high→low and the others A→Z / oldest first (`sortFirst` changes this). Empty values always go last, and text sorts naturally ("Item 2" before "Item 10").
- The sorted column shows a chevron and has `aria-sort`, so screen readers announce it.
- `defaultSort` (`{ key, direction }`) sets the first sort when `v-model:sort` isn't bound.
- The Table sorts the rows itself. With server data, pass `manualSort` and `v-model:sort`, and fetch in the new order.

## Selection and bulk actions

- **`selectable`:** adds a checkbox column. Each checkbox is named "Select" plus the primary column's text ("Select #10421"); `rowLabel` customises the row's part ("Select order #10421").
- **Header checkbox:** selects the rows on this page and turns indeterminate when only some are ticked.
- **Selected rows** take `brand-tint`.
- **Bulk bar:** while something is selected, a bar shows "3 selected", your `#bulk-actions` slot (slim Buttons) and Clear selection. Screen readers hear the count change.
- **All matching rows:** when the whole page is ticked, `totalCount` is larger and `v-model:all-matching` is bound, the bar offers "Select all 1,240" (without the binding nothing would act on all of them, so it isn't offered). The `#bulk-actions` slot gets `{ selected, allMatching }`; when `allMatching` is true, act on the query, not on the keys.
- **State:** `v-model:selected` (row keys from `rowKey`, default `row.id`), or `defaultSelected` when it isn't bound. Clear the selection when the page, search or filter changes.
- **`isRowSelectable(row)`:** rows it returns false for get a disabled checkbox.

## Opening rows

- `rowHref(row)` (a link) or `@row-click` (a button) makes the primary column the real link. With both, the link is followed and `@row-click` is called too, so a router can take over.
- A click anywhere else on the row follows it, including Ctrl/⌘-click for a new tab. Clicks on checkboxes, buttons, links, form controls, anything marked `data-row-click="ignore"` and selected text are left alone.
- Clickable rows highlight on hover.

## Row actions

The `#row-actions="{ row }"` slot holds slim ghost icon Buttons for the last column, each with an `aria-label` that names the row ("Edit Linen shirt, blue"). Keep to one or two; more belong on the record's own page.

## Loading and empty

- `loading` dims the rows, sets `aria-busy` and announces "Loading…". With no rows yet, it shows skeleton rows (`skeletonRows`, default 5).
- The `#empty` slot is what shows when there are no rows (default "No results"). Say why and what to do: "No orders match — try another search or clear the filter."

## Phones

- **`mobile="scroll"`** (default): the table scrolls sideways, and the first column (with its checkbox) stays pinned, with an edge once scrolled. `pinFirst: false` turns the pinning off; it only applies when the primary column is the first. Under 640px the pinned column is as wide as its content, up to 40%, and long names wrap. For long names (products), give the column a `minWidth` such as `'min(11rem, 40cqi)'` so they don't wrap onto many lines.
- **`mobile="cards"`:** under 640px (or `cardsBelow`, below) each row becomes a card. The checkbox, name and actions sit on top, then "Label value" lines. The header disappears; "Select all" and a "Sort by" menu sit above the cards. Use it for orders and anything people work through on a phone.
- **Both** measure the table's own width, not the screen's.
- **`cardsBelow`** (cards mode, default 640) moves the switch. A table of three or four columns fits far less than 640px: in a narrow column beside a side panel, a variants table with price and stock inputs reads better as a table, so give it `:cards-below="420"` and it turns into cards only on a phone. Leave the default for wide tables of many columns. The switch is measured in the browser, so with server rendering a phone sees the table until the page hydrates.
- **`maxHeight`** (a number in px, or a CSS length) scrolls the body inside that height; the header row stays on top.

## Density

Back-office list screens use `data-density="compact"` (40px rows), or the table's `density` prop. Comfortable (56px) suits rows with thumbnails.

## How many rows

Show up to 100 rows at a time and page through the rest with Pagination. At that size selecting all, sorting and switching views take well under 100ms. A single page of thousands of rows still works, but each sort or select-all then takes over a second while the browser lays the table out again.

## Keyboard and screen readers

- It's a real `<table>` named by its caption. Each row's primary cell is its row header, so screen readers read the row's name with every cell. The table keeps its table roles in phone cards too.
- **Tab** reaches, in order: the toolbar, the select-all checkbox, each sortable header (a button: Enter or Space sorts), then per row its checkbox, the primary link or button, any links or buttons in cells, and the row actions.
- The sorted header has `aria-sort` ("ascending" / "descending").
- When the table is wider than its frame, the scroll area becomes a focusable region named by the caption, so the arrow keys scroll it. A focused cell is kept clear of the pinned column and the sticky header.
- A status region announces the selection ("3 selected", "All 1,240 selected") and "Loading…" while `loading`. Skeleton rows are hidden from screen readers.
- The actions column's header is "Actions", visually hidden.

## What you provide

- **Required:** `caption` ("Orders"), `columns`, `rows`.
- **Optional:** `captionHidden` (a heading above already says it), `rowKey` (a field name or a function; default "id"), `rowLabel(row)` (names the row in its checkbox), `defaultSort`, `manualSort` (the rows arrive sorted), `selectable`, `defaultSelected`, `isRowSelectable(row)`, `totalCount` (all matching rows, for "Select all 1,240"), `rowHref(row)`, `loading`, `skeletonRows` (default 5), `mobile` (`scroll` | `cards`; default `scroll`), `cardsBelow` (px, default 640), `pinFirst` (default true), `maxHeight`, `density` (`comfortable` | `compact`; default: the nearest `data-density`).
- **v-model:** `v-model:sort` (`{ key, direction }` or null), `v-model:selected` (row keys), `v-model:all-matching` (default false).
- **Events:** `@row-click(row, event)` (makes rows clickable), `@update:sort`, `@update:selected`, `@update:all-matching`.
- **Slots:** `#caption`, `#toolbar`, `#footer`, `#empty`, `#cell-<key>="{ row, index, value }"`, `#header-<key>`, `#row-actions="{ row, index }"`, `#bulk-actions="{ selected, allMatching }"`.
- **Translations:** `strings`, or once for the shop with `configure({ strings: { table: … } })`: `selectAll` ("Select all rows on this page"), `selectAllShort` ("Select all"), `selectRow(label)` ("Select #10421"), `selected(count)` ("3 selected"), `selectAllMatching(total)` ("Select all 1,240"), `allMatchingSelected(total)` ("All 1,240 selected"), `clearSelection` ("Clear selection"), `actions` ("Actions"), `empty` ("No results"), `loading` ("Loading…"), `sortBy` ("Sort by"), `sortOption(header, direction)` ("Total, ascending").
