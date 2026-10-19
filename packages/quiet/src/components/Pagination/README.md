# Pagination

Moves through a long list a page at a time. It usually sits in a Table's `#footer` slot. It fits on one line at every width: it measures its own width and drops the extras as space runs out.

## Variants (`variant`)

- **`simple`** (default): the range "1–50 of 1,240", then previous and next. Use it for back-office lists that people filter more than browse.
- **`pages`**: numbered pages with gaps, ‹ 1 … 4 5 **6** 7 8 … 25 ›. It always shows the first and last page, plus `siblings` (default 1) either side of the current one. Use it for storefront category pages, and lists where people come back to "page 6".
- **`compact`**: ‹ 6 / 25 ›. Use it in narrow places: side panels and dialogs.

`pages` and `compact` need a `total`. Without one, Pagination is always `simple`.

```vue
<QPagination v-model:page="page" v-model:page-size="pageSize" :total="1240" :page-size-options="[25, 50, 100]" />
<QPagination v-model:page="page" :total="480" :page-size="24" variant="pages" size="large" align="center" :show-range="false" />
```

## Options

| Prop | What it does |
| --- | --- |
| `showFirstLast` | Adds « and » buttons for the first and last page. Useful with long lists. Needs `total`. |
| `jumpToPage` | Shows the page number as a small field — "Page [6] of 25". Needs `total`. Enter or leaving the field goes there. Numbers out of range snap to the first or last page, and an empty field restores the current page. |
| `showRange` | `false` hides "1–50 of 1,240". The storefront usually hides it. |
| `pageSizeOptions` + `v-model:page-size` | Rows-per-page select, e.g. `[25, 50, 100]`. The page size defaults to 50; bind it even without the select when your pages hold a different number. `:show-page-size="false"` hides the select again. |
| `align` | `end` (default), `start`, `center` (storefront), or `between` (range on the left, controls on the right). |
| `size` | `slim` (default; back office), `default`, `large` (storefront). The same sizes as Button. |
| `disabled` | Disables the controls while a page loads, and sets `aria-busy`. The current page number stays enabled, so focus isn't lost. |
| `hrefFor(page)` | Renders the controls as links (`?page=6`), so pages can be bookmarked, opened in a new tab and crawled. Clicks also update `v-model:page`; to route on the client, prevent the link's default and let your router take over. |
| `hasNext` | For cursor-based APIs without a total: leave out `total` and say whether there is a next page. The range then reads "51–100". With a `total` it overrides the one worked out from it. |

## Narrow widths

The bar keeps to one line by measuring its own width:

1. **Under 560px:** numbered pages turn into "6 / 25".
2. **Under 460px:** the words "Rows per page" and "Page" are hidden (still read out), the gaps get tighter, and the page-size select gets narrower.
3. **Under 400px:** the first and last buttons go. With `jumpToPage`, the range goes too (the field already shows the page).
4. **Under 280px:** the page-size select goes, and so does the range in `pages`.

## Keyboard and screen readers

- It's a `nav` landmark named "Pagination". The controls are buttons (links with `hrefFor`), each named: "First page", "Previous page", "Page 6", "Next page", "Last page". The current page has `aria-current="page"`. Controls that can't be used (Previous on page 1) are disabled.
- Tab moves through the controls; Enter or Space activates one. In the jump field, Enter goes to the page typed; so does leaving the field.
- The rows-per-page select and the jump field are labelled "Rows per page" and "Page", also when those words are hidden on narrow bars. The range and "6 / 25" are hidden from screen readers; the announcement below says the same.
- Each page change is announced: the range, or "Page 6 of 25" when the range is hidden.
- Focus never falls off the page. Pressing Next on the last page, or a number that scrolls out of the list, moves focus to the current page or the nearest control that still works.

## Why `simple` by default?

Back-office lists are searched and filtered far more than browsed page by page. Previous and next, with the range, cover almost every case and fit a phone. If people keep jumping to page 37, the list needs better filters, or `jumpToPage`.

## What you provide

- **Required:** `total` (all rows), or `hasNext` for cursor-based APIs.
- **Optional:** `variant` (`simple` | `pages` | `compact`; default `simple`), `siblings` (default 1), `showFirstLast`, `jumpToPage`, `showRange` (default true), `pageSizeOptions` (e.g. `[25, 50, 100]`), `showPageSize` (default true), `align` (`end` | `start` | `center` | `between`; default `end`), `size` (`slim` | `default` | `large`; default `slim`), `disabled`, `hrefFor(page)`.
- **v-model:** `v-model:page` (1-based; default 1), `v-model:page-size` (default 50).
- **Events:** `@update:page(page)`, `@update:page-size(size)`.
- **Translations:** `strings`, or once for the shop with `configure({ strings: { pagination: … } })`: `label` ("Pagination"), `range(from, to, total)` ("1–50 of 1,240"), `rangeOpen(from, to)` ("51–100"), `previous` ("Previous page"), `next` ("Next page"), `first` ("First page"), `last` ("Last page"), `perPage` ("Rows per page"), `page(n)` ("Page 6"), `pageOf(n, pages)` ("Page 6 of 25"), `compact(n, pages)` ("6 / 25"), `jumpLabel` ("Page"), `of(pages)` ("of 25"). Numbers follow the configured locale ("1.240" with `de-DE`).
