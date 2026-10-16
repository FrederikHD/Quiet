# SearchBox

The shop's search field with suggestions as you type: collections and products (picture, name, price), and always "Search for “…”" last. In the storefront header; full width in a dialog on phones.

```vue
<QSearchBox
  v-model="q"
  :suggestions="[{ label: 'Products', items: hits.map((p) => ({ id: p.id, label: p.name, image: p.thumb, meta: money(p.price), description: p.type })) }]"
  @select="go"
  @submit="(query) => go(`/search?q=${query}`)"
/>
```

## Behaviour

- It's a search landmark (`<form role="search">`) with a combobox field and a listbox under it — the field keeps focus while ↓ ↑ move through the suggestions (`aria-activedescendant`), Enter opens the highlighted one or searches, Esc closes the list, Esc again empties the field.
- Groups get a small heading ("Collections", "Products") and are announced as groups. The number of suggestions is announced politely.
- Clicking outside or tabbing away closes the list. A × clears the field.
- No autocorrect, no autocapitalise; the phone keyboard shows "Search" on its Enter key.
- `inline`: the list stays in the page flow — use it inside a full-screen Dialog on phones, where a floating list would be cut off by the keyboard.

## Keyboard and screen readers

A search landmark with a combobox: the field keeps focus while ↓ ↑ move through the suggestions (read as "Linen shirt, 2 of 6"), Enter opens one or searches, Esc closes the list and Esc again clears. The number of suggestions is announced as you type.

## Not for

Picking a value for a form field — that's Combobox.

## Built from

Input (with its search icon and clear button), Icon.

## What you provide

The matching (and its speed): pass suggestions for the current text. Keep it to about eight. Searching without suggestions works too — leave `suggestions` empty.
