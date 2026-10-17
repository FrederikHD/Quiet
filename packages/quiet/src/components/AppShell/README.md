# AppShell

The back-office frame: navigation on the left, the page beside it.

- **Desktop (1024px and up):** the navigation is a fixed column, 248px wide, on `surface-raised` with a `line` border. It stays in place while the page scrolls.
- **Smaller screens:** a 56px top bar with a menu button, the shop name and optional actions. The menu opens the same navigation as a drawer from the left.

## Anatomy

1. **Skip link:** the first thing on the page. It's hidden until focused, and jumps straight to the content.
2. **Brand:** the shop name in `heading` type, at the top of the column or in the top bar. No logo yet — plain type, as in the brand book.
3. **Navigation:** a Nav, passed as `nav`.
4. **Nav footer:** the account and the store switcher, pinned under the navigation. It's in the drawer too.
5. **Main:** the page — usually a Page — in the default slot. It's the `main` landmark, and the skip link's target.
6. **Top-bar end** (phones only): one or two icon buttons, such as Search.
7. **Toaster:** AppShell includes one, so `toast()` works on every page (`:toaster="false"` leaves it out).

## Drawer

- Opening it moves focus inside. Tab stays there, and the page behind is hidden from screen readers.
- Escape, the ×, the backdrop or choosing a page closes it. Closing returns focus to the menu button.
- Growing the window past 1024px closes it. The navigation is then in its column.
- It's a Dialog with `placement="start"`, so it behaves exactly like every other dialog.

## Contained

`contained` puts the shell in a box instead of the window: it fills its parent (give the parent a height), scrolls inside it, and the drawer opens over the shell only, not the whole page. Use it for previews and for a shell embedded in another page, like the examples here. A real back office leaves it off.

```vue
<div style="height: 520px">
  <QAppShell brand="Leinen & Co" contained>…</QAppShell>
</div>
```

## Rules

- One AppShell per app, around everything. Pages change inside it.
- Put the account in the `#nav-footer` slot, not in the top bar, so it's in the same place on every screen.
- Let the window scroll, not `main`. Sticky table headers and sticky FormActions depend on it.

## What you provide

- **Required:** the `#nav` slot (a Nav) and the page as the default slot.
- **Optional:** `brand` (or `#brand`), the `#nav-footer` and `#top-bar-end` slots, `main-id`, `contained` (fill a parent box instead of the window), `:toaster="false"`.
- **`strings`:** the menu button, the skip link and the close button ("Menü", "Zum Inhalt springen", "Menü schließen"). You can also set them once for the shop with `configure({ strings: { shell: … } })`.
