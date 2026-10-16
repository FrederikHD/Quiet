# EmptyState

What to show when there's nothing to show: no products match the filters, no search results, no reviews yet, no orders today. Says why, and offers the next step.

```vue
<QEmptyState icon="filter" title="No products match these filters">
  <p>Try removing a filter or two.</p>
  <template #actions><QButton @click="clear">Clear filters</QButton></template>
</QEmptyState>
```

## Behaviour

- Centred: an icon in a 56px `surface-sunken` circle, a heading (`headingLevel`, default 2) in 17px semibold, one or two sentences in `ink-muted`, then up to two actions.
- `size="small"` for inside a section (no reviews yet), default for a whole results area.

## Writing it

- The title says what's empty, specifically: "No results for “lnen”", not "Nothing found".
- The text says what to do: "Check the spelling, or try a more general word like “shirt”."
- The action does the obvious thing: Clear filters, See all products, Write the first review.
- Never blame: "No products match these filters", not "Your filters are too narrow".

## Built from

Icon; your actions are Buttons.

## What you provide

A specific `title`, one or two sentences of what to do, and the action that does it.
