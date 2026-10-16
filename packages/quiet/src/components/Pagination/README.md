# Pagination

Moves through a long list a page at a time. It usually sits in a Table's `footer`. It fits on one line at every width: it measures its own width and drops the extras as space runs out.

## Variants (`variant`)

- **`simple`** (default): the range "1–50 of 1,240", then previous and next. Use it for back-office lists that people filter more than browse.
- **`pages`**: numbered pages with gaps, ‹ 1 … 4 5 **6** 7 8 … 25 ›. It always shows the first and last page, plus `siblings` (default 1) either side of the current one. Use it for storefront category pages, and lists where people come back to "page 6".
- **`compact`**: ‹ 6 / 25 ›. Use it in narrow places: side panels and dialogs.

`pages` and `compact` need a `total`. Without one, Pagination is always `simple`.

## Options

| Prop | What it does |
| --- | --- |
| `showFirstLast` | Adds « and » buttons for the first and last page. Useful with long lists. |
| `jumpToPage` | Shows the page number as a small field — "Page [6] of 25". Enter or leaving the field goes there. Numbers out of range snap to the first or last page, and an empty field restores the current page. |
| `showRange` | `false` hides "1–50 of 1,240". The storefront usually hides it. |
| `page-size-options` + `v-model:page-size` | Rows-per-page select, e.g. `[25, 50, 100]`. |
| `align` | `end` (default), `start`, `center` (storefront), or `between` (range on the left, controls on the right). |
| `size` | `slim` (default; back office), `default`, `large` (storefront). The same sizes as Button. |
| `disabled` | Disables every control while a page loads, and sets `aria-busy`. |
| `hrefFor(page)` | Renders the controls as links (`?page=6`), so pages can be bookmarked, opened in a new tab and crawled. Clicks also update `v-model:page`; prevent the default to route on the client instead of following the link, so a client-side router can take over. |
| `hasNext` | For cursor-based APIs without a total: leave out `total` and say whether there is a next page. The range then reads "51–100". |

## Narrow widths

The bar keeps to one line by measuring its own width:

1. **Under 560px:** numbered pages turn into "6 / 25".
2. **Under 460px:** the words "Rows per page" and "Page" are hidden (still read out), the gaps get tighter, and the page-size select gets narrower.
3. **Under 400px:** the first and last buttons go. With `jumpToPage`, the range goes too (the field already shows the page).
4. **Under 280px:** the page-size select goes, and so does the range in `pages`.

## Keyboard and screen readers

- It's a `nav` landmark named "Pagination". Each control is named: "Previous page", "Page 6". The current page has `aria-current="page"`.
- Each page change is announced: the range, or "Page 6 of 25" when the range is hidden.
- Focus never falls off the page. Pressing Next on the last page, or a number that scrolls out of the list, moves focus to the current page or the nearest control that still works.

## Why `simple` by default?

Back-office lists are searched and filtered far more than browsed page by page. Previous and next, with the range, cover almost every case and fit a phone. If people keep jumping to page 37, the list needs better filters, or `jumpToPage`.

## What you provide

- **Required:** `v-model:page` (1-based), `page-size`, `total` (or `has-next`).
- **Optional:** `variant`, `siblings`, `show-first-last`, `jump-to-page`, `show-range`, `page-size-options` with `v-model:page-size`, `align`, `size`, `disabled`, `href-for`, `class`.
- **`strings`** to translate: "Zeilen pro Seite", "1–50 von 1.240", "Vorherige Seite", "Nächste Seite", "Erste Seite", "Letzte Seite", "Seite 6", "Seite 6 von 25", "von 25". You can also set these once for the whole shop with `configure`. Numbers follow the configured locale ("1.240" with `de-DE`).
