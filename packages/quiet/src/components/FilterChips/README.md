# FilterChips

The filters in use, above the results: "● Navy ×  Size M ×  30 € – 90 € ×  Clear all". One tap removes one.

```vue
<QFilterChips
  :items="[{ key: 'c:navy', label: 'Navy', swatch: navy }, { key: 's:M', label: 'Size M' }]"
  @remove="removeFilter"
  @clear="clearAll"
/>
```

## Behaviour

- Each chip is a removable Tag — one button named "Remove filter: Navy"; a colour filter can show its dot.
- "Clear all" appears from two chips up.
- **Focus never drops:** after a removal it moves to the chip that took its place, then the one before, then Clear all, then the chip row itself (or `empty-focus`).
- 32px tall (40px on phones), `line-strong` outline on `surface-raised`; hover darkens the outline.
- With no chips it takes no space.

## Keyboard and screen readers

A group named "Active filters" of buttons named "Remove filter: Navy". After a removal focus moves to the next chip, then Clear all, then the group — it's never lost.

## Built from

Tag (one removable pill per filter).

## What you provide

`items` in the order the filters appear in the panel; keys you can map back to filters.
