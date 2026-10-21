# Dialog

A modal window over a dimmed page, for a task that needs full attention before going back: confirm a deletion, edit an address, pick a product on a phone, read terms.

```vue
<QButton variant="danger" @click="confirming = true">Delete</QButton>
<QDialog
  v-model:open="confirming"
  title="Delete “Linen shirt, blue”?"
  description="It's removed from the shop. This can't be undone."
  size="sm"
  role="alertdialog"
>
  <template #footer>
    <QButton @click="confirming = false">Cancel</QButton>
    <QButton variant="danger" @click="remove">Delete product</QButton>
  </template>
</QDialog>
```

## When to use

- **Dialog** — the task is short, self-contained and blocks what comes next: confirmations, a small form, a picker on a phone.
- **Popover** — a few controls next to what they change (order status, columns), where the rest of the page should stay visible.
- **A page** — anything long, anything people may want to bookmark or come back to, or more than one step. Don't stack dialogs on dialogs.

## Anatomy

`overlay` backdrop; a `surface-raised` panel with a `line-strong` border (so its edge reads on the dark backdrop in both themes) and `radius-lg`; header with the title (`heading`, 17/24 semibold) and a × button; optional description in `ink-muted`; the body, which scrolls on its own when it's long; an optional footer with the buttons, separated by a `line` rule.

## Sizes

- `sm` 400px — confirmations.
- `md` 560px (default) — short forms, pickers.
- `lg` 760px — longer forms, terms, small tables.

The panel never gets taller than the screen minus 32px; the header and footer stay put and the body scrolls.

## Phones (under 640px)

- `mobile="sheet"` (default) — slides up from the bottom, full width, rounded top corners, up to the full height minus 24px.
- `mobile="inset"` — a floating card with 12px of backdrop visible all round, aligned to the top so the keyboard doesn't push it about: pickers and search. Combobox uses this.
- `mobile="full"` — fills the screen edge to edge, for long forms where every pixel counts.
- Footer buttons stack full width with the primary on top.

## Drawers

`placement="start"` (or `"end"`) makes a drawer: full height from the left (or right), `min(320px, 88vw)` wide, on every screen. AppShell's phone navigation is one. Use it for navigation and for filter panels beside a list. Everything below applies too.

## Behaviour

- Escape, a click on the backdrop, or the × closes it — all emit `@close` and set `v-model:open` to false. Setting `v-model:open` to false yourself closes it without `@close`.
- A confirm opened from inside a dialog (a Menu item, say) stacks on top: Escape closes only the top one, and the one below comes back to life. The page stays locked until the last dialog closes, in whatever order they close or unmount (navigating away included).
- Layers: a dropdown or help tip opened inside a dialog sits above it, and Escape closes the topmost layer first.
- `:dismissible="false"` removes the ×, Escape and backdrop closing — only for a step that must be answered. A `close-text` button still shows, as one way to answer.
- `close-text="Done"` puts a text button in the header in place of the ×.
- `flush` removes the body's padding, for content that scrolls on its own (a list).
- `density` sets `comfortable` or `compact` inside the dialog. By default it takes the density around the element that opened it.
- `teleport` says where it renders: a selector, `"body"` by default. `:teleport="false"` renders it in place, so it covers the nearest ancestor with a transform instead of the window — for previews and embedded shells.
- Attributes such as `class` go to the panel, not the backdrop. A template ref gives `panel` and `close()`.

## Keyboard and screen readers

- **Opening** moves focus inside: to `initial-focus` if given, else the first control in the body that Tab would reach (shown, not `tabindex="-1"`, not inside `aria-hidden`; in a radio group, its checked radio), else the first footer button (so a confirmation starts on Cancel), else the dialog itself.
- **Tab and Shift+Tab** wrap round inside the dialog. The page behind is made inert: it can't be scrolled, clicked or reached by keyboard or screen reader.
- **Escape** closes it, unless it isn't dismissible or another layer sits on top.
- **Closing** returns focus to the element that opened it. If that element is gone (the dialog deleted its table row), focus goes to the same control in the next row, else the previous one, else the nearest control around it, else the page's `main`.
- **Roles:** the panel is `role="dialog"` (or `alertdialog`) with `aria-modal="true"`, named by the title (an `h2`) and described by the description, so both are read when it opens.
- **Toasts** stay readable: the toaster isn't made inert while a dialog is open.

## Writing it

- **Title** says what the dialog is for or asks the question: "Delete “Linen shirt, blue”?", "Edit shipping address". Not "Warning" or "Are you sure?".
- **Description** gives the consequence in one or two sentences: what changes, what doesn't, whether it can be undone.
- **Buttons** name the action — "Delete product", "Save address" — never "OK" / "Yes". Cancel first, primary last. A destructive action uses the `danger` Button.
- Use `role="alertdialog"` for confirmations that interrupt; screen readers announce it as an alert.

## What you provide

- **Required:** `title` ("Delete product?"; or the `#title` slot), and the content (default slot).
- **Optional:** `description` (or `#description`), `size` (`sm` | `md` | `lg`, default `md`), `placement` (`center` | `start` | `end`, default `center`), `mobile` (`sheet` | `inset` | `full`, default `sheet`), `role` (`dialog` | `alertdialog`, default `dialog`), `dismissible` (default true), `closeText` (a text button in place of the ×), `initialFocus`, `flush`, `density` (`comfortable` | `compact`, default: inherited), `teleport` (default "body"; false renders in place).
- **v-model:** `v-model:open` (default false).
- **Events:** `@close` (Escape, the backdrop or the close button).
- **Slots:** the default slot (the body), `#title`, `#description`, `#footer` (Buttons, primary last; a form's submit button can sit here with `form="<form id>"`).
- **Translations:** `strings` — `close` (the ×'s name, "Close"); or once for the shop with `configure({ strings: { dialog: { close: 'Schließen' } } })`.
