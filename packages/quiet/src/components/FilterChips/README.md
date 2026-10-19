# FilterChips

The filters in use, above the results: "● Navy × Size M × 30 € – 90 € × Clear all". One tap removes one.

```vue
<QFilterChips
  :items="[
    { key: 'c:navy', label: 'Navy', swatch: '#1f2a44' },
    { key: 's:M', label: 'Size M' },
    inStock && { key: 'stock', label: 'In stock' },
  ]"
  @remove="removeFilter"
  @clear="clearAll"
/>
```

## Behaviour

- Each chip is a removable Tag — one button named "Remove filter: Navy"; a colour filter can show its dot.
- `null` and `false` items are skipped, so `inStock && { … }` works.
- "Clear all" appears from two chips up; `:clearable="false"` leaves it out. It emits `@clear`; you empty the filters.
- Pressing a chip emits `@remove` with its `key`; you drop that filter and the chip goes with it.
- **Focus never drops:** after a removal it moves to the chip that took its place, or the one before, then Clear all, then `emptyFocus` if you pass one, then the chip row itself. After Clear all it goes to `emptyFocus` or the row.
- Chips and Clear all are 32px tall (40px on phones); the chips have a `line-strong` outline on `surface-raised`, and hover darkens the outline.
- With no chips it takes no space.

## Keyboard and screen readers

- A group named "Active filters" holding a list of buttons named "Remove filter: Navy", then a "Clear all" button. Each is reached with Tab and pressed with Enter or Space.
- A colour dot is decorative; the label names the filter.
- After a removal focus moves to the chip that took its place (or the one before), then Clear all, then `emptyFocus`, then the group itself (it takes focus with `tabindex="-1"`) — it's never lost.

## Built from

Tag (one removable pill per filter).

## What you provide

`items` in the order the filters appear in the panel, with keys you can map back to filters.

- **Required:** `items` (`{ key, label, swatch? }`, or `null` / `false` to skip).
- **Optional:** `clearable` (default `true`), `emptyFocus` (the element that gets focus when the last chip goes, such as the filter button; default the chip row).
- **Events:** `@remove(key)` when a chip is pressed, `@clear` when Clear all is pressed.
- **Translations:** `strings`, or once with `configure({ strings: { filterChips: … } })` — `label` ("Active filters"), `remove(label)` ("Remove filter: Navy"), `clear` ("Clear all").
