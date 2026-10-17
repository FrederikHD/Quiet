# Table

Back-office lists: orders, products, customers, refunds. It's a real `<table>` and adds:

- **Sorting** by column.
- **Row selection** with a bulk-action bar and "Select all 1,240".
- **Rows that open** when clicked.
- **Row actions**, loading and empty states.
- **Phone layouts:** a sideways scroll with the first column pinned, or one card per row.

## When to use

- **Table:** records people scan, compare, sort and act on — the same fields for every row.
- **Not for layout,** and not for one record's details. Use a description list or a form for those.
- **Storefront:** product grids are cards, not tables. Tables in the shop are for order history and size charts.

## Anatomy

- **Frame:** `surface-raised`, a `line` border, `radius-lg`.
- **Optional toolbar** on top: search Input and filter Selects, all `size="slim"`.
- **Header row:** `surface-sunken`, `label` type (13/16 medium) in `ink-muted`; the sorted column turns `ink`.
- **Body rows:** `--row-h` tall (56px comfortable, 40px compact), `--cell-pad-x` / `--cell-pad-y` padding, `--cell-text`, and `line` rules between rows.
- **First column:** the row's name (order number, product name). It's the row header, in medium weight.
- **Numbers** (`numeric`): right-aligned with tabular figures, header included.
- **Optional footer:** usually a Pagination.

## Columns

`columns` is a list of `{ key, header, … }`:

| Field | What it does |
| --- | --- |
| `key` | Field name in the row, and the sort key. |
| `header` | Header text (rich headers: the `#header-<key>` slot). |
| `format(row)` | Plain text for the cell; default `row[key]`. For rich cells (a Badge for statuses) use the `#cell-<key>` slot. |
| `numeric` | Right-aligned, tabular figures; sorts high to low first. |
| `align` | `start` / `end` / `center`. |
| `sortable`, `sortValue(row)`, `sortFirst` | Make it sortable; the value to sort by; the first direction. |
| `sortLabels` | Phone sort menu wording, e.g. `['Oldest first', 'Newest first']`. |
| `primary` | The column that names the row (default: the first). |
| `truncate` | One line with an ellipsis (18rem, or the length you pass); the full text shows on hover (native title) and in phone cards. |
| `wrap` | Let long text wrap (12rem minimum). |
| `width`, `minWidth` | Column width. |
| `mobile: false` | Hide this column in phone cards. |

## Sorting

- Click a sortable header to sort; click again to reverse. Text and dates sort A→Z / oldest first, numbers high→low, and empty values always go last.
- The sorted column shows a chevron and has `aria-sort`, so screen readers announce it.
- The Table sorts the rows itself. With server data, pass `manual-sort` and `v-model:sort`, and fetch in the new order.

## Selection and bulk actions

- **`selectable`:** adds a checkbox column. Each checkbox is named "Select order #10421" (`rowLabel` customises it).
- **Header checkbox:** selects the rows on this page and turns indeterminate when only some are ticked.
- **Selected rows** take `brand-tint`.
- **Bulk bar:** while something is selected, a bar shows "3 selected", your `#bulk-actions` slot (slim Buttons) and Clear selection. Screen readers hear the count change.
- **All matching rows:** when the whole page is ticked and `totalCount` is larger, the bar offers "Select all 1,240". Handle it with `v-model:all-matching`. Your bulk action then receives `{ allMatching: true }` and should act on the query, not on the keys.
- **State:** `v-model:selected` (row keys from `row-key`, default `row.id`). Clear the selection when the page, search or filter changes.
- **`isRowSelectable(row)`:** greys out rows that can't be picked.

## Opening rows

- `row-href` (a link) or `@row-click` (a button) makes the first column the real link.
- A click anywhere else on the row follows it, including Ctrl/⌘-click for a new tab. Clicks on checkboxes, buttons, links and selected text are left alone.
- Keyboard users Tab to the link. Clickable rows highlight on hover.

## Row actions

The `#row-actions="{ row }"` slot holds slim ghost icon Buttons for the last column, each with an `aria-label` that names the row ("Edit Linen shirt, blue"). Keep to one or two; more belong on the record's own page.

## Loading and empty

- `loading` dims the rows and sets `aria-busy`. With no rows yet, it shows 5 skeleton rows (`skeletonRows`).
- The `#empty` slot is what shows when there are no rows. Say why and what to do: "No orders match — try another search or clear the filter."

## Phones

- **`mobile="scroll"`** (default): the table scrolls sideways, and the first column (with its checkbox) stays pinned, with an edge once scrolled. On narrow screens the pinned column is as wide as its content, up to 40%, and long names wrap. For long names (products), give the column a `minWidth` such as `'min(11rem, 40cqi)'` so they don't wrap onto many lines. A table that scrolls can be reached and scrolled with the keyboard.
- **`mobile="cards"`:** under 640px each row becomes a card. The checkbox, name and actions sit on top, then "Label  value" lines. The header disappears; "Select all" and a "Sort by" menu sit above the cards. Use it for orders and anything people work through on a phone.
- **Both** measure the table's own width, not the screen's.

## Density

Back-office list screens use `data-density="compact"` (40px rows), or the table's `density` prop. Comfortable (56px) suits rows with thumbnails.

## How many rows

Show up to 100 rows at a time and page through the rest with Pagination. At that size selecting all, sorting and switching views take well under 100ms. A single page of thousands of rows still works, but each sort or select-all then takes over a second while the browser lays the table out again.

## What you provide

- **Required:** `caption` ("Orders"; `captionHidden` when a heading above already says it), `columns`, `rows`.
- **Optional:** `row-key`, `row-label`, `v-model:sort` / `default-sort` / `manual-sort`, `selectable` / `v-model:selected` / `default-selected` / the `#bulk-actions` slot / `total-count` / `v-model:all-matching` / `is-row-selectable`, `row-href` / `@row-click`, the `#row-actions` slot, `loading`, the `#empty`, `#toolbar` and `#footer` slots, rich cells in `#cell-<key>` slots, `mobile`, `pin-first`, `max-height` (the header stays while the body scrolls), `density`, `strings` (translations; or once for the shop with `configure`).
