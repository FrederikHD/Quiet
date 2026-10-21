# AppShell

The back-office frame: navigation on the left, the page beside it.

- **Desktop (1024px and up):** the navigation is a fixed column, 248px wide, on `surface-raised` with a `line` border. It stays in place while the page scrolls.
- **Below 1024px:** a 56px top bar with a menu button, the shop name and optional actions, sticky at the top. The menu opens the same navigation as a drawer from the left.

## Anatomy

1. **Skip link:** the first thing on the page. It's hidden until focused, and jumps straight to the content.
2. **Brand:** the shop name (`brand`) in 17/24 semibold, at the top of the column, in the top bar and as the drawer's title. No logo yet — plain type, as in the brand book; the `#brand` slot takes richer content in the column and the top bar. The drawer's title is always the `brand` text, or "Menu" without it, so set `brand` even when you use the slot.
3. **Navigation:** a Nav, in the `#nav` slot.
4. **Nav footer:** the account and the store switcher (`#nav-footer`), pinned under the navigation. It's in the drawer too.
5. **Main:** the page — usually a Page — in the default slot. It's the `main` landmark, and the skip link's target.
6. **Top-bar end** (`#top-bar-end`, below 1024px only): one or two icon buttons, such as Search.
7. **Toaster:** AppShell includes one, so `toast()` works on every page (`:toaster="false"` leaves it out).

## Drawer

- Opening it moves focus inside. Tab stays there, and the page behind is hidden from screen readers.
- Escape, the ×, the backdrop or choosing a page closes it. Choosing a page means clicking a link, a Nav item (also one without `href`, for a router) or an element marked `data-nav-close`. Closing returns focus to the menu button.
- Growing the window to 1024px or wider closes it. The navigation is then in its column.
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

## Keyboard and screen readers

- **Skip link:** the first Tab stop, "Skip to content". It's hidden until focused; Enter moves focus to `main` (it has `tabindex="-1"`) and scrolls there.
- **Landmarks:** the top bar is a `header`, the page is `main`, and the Nav is a `nav` named "Main" (see Nav).
- **Menu button:** an icon button named "Menu" with `aria-expanded`. The drawer is a modal dialog (`aria-modal="true"`) titled by the brand, or "Menu" without one. Focus moves inside and Tab stays there; the rest of the page is inert. Its close button is named "Close menu".
- **Toasts:** the built-in Toaster's live regions exist from the start, so the first toast is announced too.

## What you provide

- **Required:** the `#nav` slot (a Nav), the page in the default slot.
- **Optional:** `brand` (the shop name), `mainId` (the id of `main`; generated when missing), `contained` (fill a parent box instead of the window), `toaster` (default `true`; `:toaster="false"` leaves it out; translate the toasts with `configure({ strings: { toast } })`).
- **Slots:** `#nav`, the default slot (the page), `#brand` (instead of `brand`), `#nav-footer` (account, store switcher), `#top-bar-end` (icon buttons in the top bar below 1024px).
- **Translations:** `strings` — `menu` ("Menu", also the drawer's title without a brand), `skip` ("Skip to content") and `closeMenu` ("Close menu"). Or set them once with `configure({ strings: { shell: { menu: 'Menü', skip: 'Zum Inhalt springen', closeMenu: 'Menü schließen' } } })`. The Nav inside names its own landmark: `configure({ strings: { nav: { label: 'Hauptmenü' } } })`.
