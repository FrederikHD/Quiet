# Page

One back-office screen: a header with the title and actions, and the content. Optionally there's a side column, like a product edit page with Status and Organisation on the right.

## Anatomy

1. **Back link** (`back: { href?, label }`; without `href` it is a button that emits `back`): an arrow with the parent's name — "← Products" — on detail and edit pages.
2. **Title:** the page's one `h1`, in `title` type (22/28 semibold): "Orders", or "Linen shirt, blue" on a detail page.
3. **Title meta:** badges right after the title, such as the status. Use one or two.
4. **Subtitle:** one line in `ink-muted`: the SKU, the date, "Last saved 2 minutes ago".
5. **Actions:** on the right, lined up with the title. The page's main action is a `primary` Button and goes last. On narrow screens they wrap under the title.
6. **Content:** Cards, Tables and Forms, `space-4` apart.

## Width (`width`)

- `default`: up to 1200px of content. Use it for lists and dashboards.
- `narrow`: up to 720px. Use it for settings and single-column forms.
- `full`: as wide as the window. Use it for wide tables people compare across.

The gutters are `space-8` (32px), and `space-4` on phones.

## Side column (`aside`)

Content in `aside` sits to the right at a 2 : 1 split once the page is 900px wide, and below the main column on smaller screens. Put the things people check rather than edit there: status, organisation, a summary, notes.

## One form across both columns

An edit page whose fields sit in both columns needs a single Form around them, so there's one error summary and one sticky Save. Use `PageColumns` inside the Form, instead of Page's `aside`:

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
- Set `density="compact"` on list pages (orders, products). Edit pages stay comfortable.

## What you provide

- **Required:** `title` and the content (default slot).
- **Optional:** `back`, `subtitle`, the `#title-meta`, `#actions` and `#aside` slots, `width`, `density`, `class`.
