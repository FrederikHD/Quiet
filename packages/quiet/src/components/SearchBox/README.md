# SearchBox

The shop's search field with suggestions as you type: collections and products (picture, name, price), and always "Search for “…”" last. In the storefront header; full width in a dialog on phones.

```vue
<QSearchBox
  v-model="q"
  :suggestions="[
    {
      label: 'Products',
      items: hits.map((p) => ({
        id: p.id,
        label: p.name,
        image: { src: p.thumb },
        meta: money(p.price),
        description: p.type,
      })),
    },
  ]"
  @select="go"
  @submit="(query) => go(`/search?q=${encodeURIComponent(query)}`)"
/>
```

## Behaviour

- The list opens when the field has text and focus, and there is something to show. Each row has a picture (`image: { src }`) or an icon (`icon`), the `label`, an optional `description` line and `meta` (a price) on the right. Pass a flat list, or groups `[{ label: 'Products', items: [...] }]`.
- "Search for “…”" is always the last option while there is text (`:search-option="false"` leaves it out). It, Enter without a highlighted suggestion, and submitting the form emit `@submit(query)` with the trimmed text; an empty field never submits.
- Choosing a suggestion emits `@select(item)` with your item as you passed it, and closes the list.
- Groups get a small heading ("Collections", "Products"), with a rule between groups.
- Clicking outside or tabbing away closes the list. A × ("Clear search") clears the field and closes the list.
- No autocorrect, no autocapitalise; the phone keyboard shows "Search" on its Enter key.
- `size="large"` (48px) for the storefront header and phones; `default` follows the density (40px comfortable, 32px compact).
- `autofocus` focuses the field when it mounts, for a search dialog that has just opened.
- `inline`: the list stays in the page flow — use it inside a full-screen Dialog on phones, where a floating list would be cut off by the keyboard.

## On phones

A search field doesn't fit a phone's header next to the brand and the cart. Put a ghost icon Button ("Search") there instead, and open a Dialog with `mobile="full"` holding an `inline` SearchBox at `size="large"`: the Dialog focuses the field, and the list stays in the flow above the keyboard. While the field is empty, show a few popular searches under it. Close the dialog on `@submit` and `@select`. The Product page and Collection patterns do this under 640px.

## Keyboard and screen readers

- A search landmark (`<form role="search">`). The field is a `combobox` with a visually hidden label (`label`, default "Search") and `aria-expanded`; the list is a `listbox` with the same name.
- Focus stays in the field. ↓ opens the list, or moves down; ↑ moves up; both wrap round. The highlighted row is announced through `aria-activedescendant` and `aria-selected`.
- Enter opens the highlighted suggestion, or searches when none is highlighted. Escape closes the list; Escape again empties the field. Tab closes the list and moves on.
- Group headings are hidden as text but name their `role="group"`, so screen readers say which group a suggestion is in.
- The number of suggestions ("3 suggestions", "No suggestions") is announced politely as it changes; "Search for “…”" isn't counted.
- Pictures and icons are hidden from screen readers; the label names each row.

## Not for

Picking a value for a form field — that's Combobox.

## Built from

Input (with its search icon and clear button), Icon.

## What you provide

- **Optional:** `suggestions` (`{ id?, label, description?, image?, icon?, meta? }`, flat or in groups `{ label?, items }`; keep it to about eight, matched to the current text — leave it empty to search without suggestions), `searchOption` (default `true`), `inline`, `size` (`default` | `large`, default `default`), `label` (the hidden field name: "Search products"), `placeholder` (default "Search"), `autofocus`.
- **v-model:** `v-model` (the text in the field).
- **Events:** `@submit(query)` (Enter, the "Search for “…”" option or a form submit), `@select(item)` (a suggestion was chosen).
- **Translations:** `strings` — `label` ("Search"), `placeholder` ("Search"), `clear` ("Clear search"), `searchFor` (`(q) => "Search for “q”"`), `count` (`(n) => "3 suggestions"`; "1 suggestion", "No suggestions"). Or set them once with `configure({ strings: { search: … } })`.
