# Page

One back-office screen: a header with the title and actions, and the content. Optionally there's a side column, like a product edit page with Status and Organisation on the right.

## Anatomy

1. **Back link** (`back: { href?, label }`): an arrow with the parent's name — "← Products" — in 13px `ink-muted` on detail and edit pages. With `href` it's a link; without, a button. Either way a click emits `@back(event)`, for client-side routing.
2. **Title:** the page's one `h1`, in `title` type (22/28 semibold): "Orders", or "Linen shirt, blue" on a detail page.
3. **Title meta** (`#title-meta`): badges right after the title, such as the status. Use one or two.
4. **Subtitle:** one line in 13px `ink-muted` (`subtitle`, or the `#subtitle` slot): the SKU, the date, "Last saved 2 minutes ago".
5. **Actions** (`#actions`): on the right, lined up with the title. The page's main action is a `primary` Button and goes last. On narrow screens they wrap under the title.
6. **Content** (the default slot): Cards, Tables and Forms, `space-4` apart.

## Width (`width`)

- `default`: up to 1200px of content. Use it for lists and dashboards.
- `narrow`: up to 720px. Use it for settings and single-column forms.
- `full`: as wide as the window. Use it for wide tables people compare across.

The gutters are `space-8` (32px), and `space-4` (16px) on phones.

## Side column (`aside`)

Content in the `#aside` slot sits to the right at a 2 : 1 split, `space-6` apart, once the page itself is 900px wide (a container query, so it works inside an AppShell), and below the main column when narrower. Put the things people check rather than edit there: status, organisation, a summary, notes.

## One form across both columns

An edit page whose fields sit in both columns needs a single Form around them, so there's one error summary and one sticky Save. Use `QPageColumns` inside the Form, instead of Page's `#aside` slot. It has the same two columns and the same 900px breakpoint:

```vue
<QPage title="Linen shirt, blue" :back="{ href: '#products', label: 'Products' }">
  <QForm :errors="errors" @submit.prevent="save">
    <QPageColumns>
      <QCard title="Details">…</QCard>
      <QCard title="Pricing">…</QCard>
      <template #aside>
        <QCard title="Status">…</QCard>
        <QCard title="Organisation">…</QCard>
      </template>
    </QPageColumns>
    <QFormActions sticky align="between">…</QFormActions>
  </QForm>
</QPage>
```

## Rules

- One Page per screen, one `h1` per Page. Cards inside use `h2`.
- Save and Cancel for an edit page go in sticky FormActions at the bottom, not in the header. The header carries actions about the record: Duplicate, Preview, Print.
- Set `density="compact"` on list pages (orders, products); it sets `data-density` for everything on the page. Edit pages stay comfortable.

## Keyboard and screen readers

- The title is the page's only `h1`; Cards inside use `h2`.
- The back link is an ordinary link (or a button without `href`) named by its label, "Products"; the arrow is hidden from screen readers.
- Page adds no landmark of its own: it sits inside AppShell's `main`.

## What you provide

- **Required:** `title` ("Orders"), the content in the default slot.
- **Optional:** `back` (`{ href?, label }`), `subtitle`, `width` (`default` | `narrow` | `full`, default `default`), `density` (`comfortable` | `compact`; inherited when not set).
- **Events:** `@back(event)` when the back link is clicked.
- **Slots:** the default slot (the content, or the main column with an aside), `#subtitle` (instead of `subtitle`), `#title-meta` (badges after the title), `#actions` (buttons on the right, primary last), `#aside` (the side column).

### QPageColumns

- **Slots:** the default slot (the main column), `#aside` (the side column).
