# EmptyState

What to show when there's nothing to show: no products match the filters, no search results, no reviews yet, no orders today. Says why, and offers the next step.

```vue
<QEmptyState icon="filter" title="No products match these filters">
  <p>Try removing a filter or two.</p>
  <template #actions><QButton @click="clear">Clear filters</QButton></template>
</QEmptyState>
```

## Behaviour

- Centred: a 24px icon (`icon`, default `search`; `:icon="null"` for none) in a 56px `surface-sunken` circle, a heading (`headingLevel`, default 2) in 17px semibold, one or two sentences in `ink-muted`, then up to two actions.
- `size="small"` for inside a section (no reviews yet), with less padding; the default for a whole results area.
- `:heading-level="1"` when it is the whole page (a 404).

## Writing it

- The title says what's empty, specifically: "No results for “lnen”", not "Nothing found".
- The text says what to do: "Check the spelling, or try a more general word like “shirt”."
- The action does the obvious thing: Clear filters, See all products, Write the first review.
- Never blame: "No products match these filters", not "Your filters are too narrow".

## Keyboard and screen readers

The title is a real heading, so people can jump to it; the icon is hidden. Pass `role="status"` when it replaces results after a search or filter, so the change is announced. Screen readers only announce changes inside a live region that already exists, so a status that appears together with its text may be missed: keep the result count in a status region that stays on the page as well.

## Built from

Icon; your actions are Buttons.

## What you provide

- **Required:** `title` ("No results for “lnen”"; or the `#title` slot).
- **Optional:** `icon` (default `search`; null for none), `headingLevel` (1–6, default 2), `size` (`default` | `small`), `role` (`status` when it replaces results).
- **Slots:** the default slot (one or two sentences of what to do), `#title` (in place of `title`), `#actions` (up to two Buttons).
