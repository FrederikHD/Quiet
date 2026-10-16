# Breadcrumbs

Shows where a page sits in the shop: Home › Women › Shirts › Linen shirt. On collection and product pages, above the title.

```vue
<QBreadcrumbs :items="[{ label: 'Home', href: '/' }, { label: 'Shirts', href: '/shirts' }, { label: 'Linen shirt' }]" />
```

## Behaviour

- Each item is a link except the last, which is the current page (`aria-current="page"`) when it has no `href`.
- `chevron-right` separators, `small` type: links in `ink-muted`, the current page in `ink`. Long names end in "…".
- **Narrow** (under 480px of its own width): only the parent, as "← Shirts" — on a phone that is the step people want, and the page title already names the current page.
- It's a `nav` landmark named "Breadcrumb" (translate with `strings.label`, or `strings.breadcrumbs.label` once for the shop).

## Not for

The back office uses Page's `back` link (one level up) instead — its pages are shallow.

## Keyboard and screen readers

A `nav` named "Breadcrumb" with an ordered list; the current page is marked `aria-current="page"`. Narrow, the one link left is still named by its page ("Shirts").

## Built from

Icon (separators, the back arrow).

## What you provide

`items`: `{ label, href? }` from the top level down, the current page last without `href`. For a client-side router, listen to `navigate` and prevent the default.
