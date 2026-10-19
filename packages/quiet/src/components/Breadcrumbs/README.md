# Breadcrumbs

Shows where a page sits in the shop: Home › Women › Shirts › Linen shirt. On collection and product pages, above the title.

```vue
<QBreadcrumbs :items="[{ label: 'Home', href: '/' }, { label: 'Shirts', href: '/shirts' }, { label: 'Linen shirt' }]" />
```

## Behaviour

- Each item is a link except the last, which is the current page (`aria-current="page"`) when it has no `href`. `null` and `false` items are skipped, so `cond && { … }` leaves one out.
- `chevron-right` separators (16px), 13/18 type: links in `ink-muted`, the current page in `ink`. Long names end in "…"; the row wraps when it doesn't fit.
- **Narrow** (under 480px of its own width): only the parent, as "← Shirts" — on a phone that is the step people want, and the page title already names the current page.
- It's a `nav` landmark named "Breadcrumb" (translate with `strings.label`, or once for the shop with `configure({ strings: { breadcrumbs: { label: 'Navigationspfad' } } })`).
- Each click on a link emits `@navigate(item, event)`. For a client-side router, listen to it and call `event.preventDefault()`.

## Not for

The back office uses Page's `back` link (one level up) instead — its pages are shallow.

## Keyboard and screen readers

- A `nav` named "Breadcrumb" (an `aria-label` on the component wins) with an ordered list; the current page is marked `aria-current="page"` and isn't a link.
- The separators and the narrow back arrow are hidden from screen readers.
- Narrow, the hidden items are gone for screen readers too; the one link left is still named by its page ("Shirts").

## Built from

Icon (separators, the back arrow).

## What you provide

- **Required:** `items` — `{ label, href? }` from the top level down, the current page last without `href`.
- **Events:** `@navigate(item, event)` when a link is clicked.
- **Translations:** `strings` — `label` ("Breadcrumb", the landmark's name). Or set it once with `configure({ strings: { breadcrumbs: { label: … } } })`.
