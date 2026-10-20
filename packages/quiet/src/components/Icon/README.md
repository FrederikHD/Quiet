# Icon

A single icon from the Quiet set: 54 outline icons drawn on a 20px grid with a 1.5px round stroke, coloured by the surrounding text.

## The set

- **Status and help:** info, help, alert-circle, alert-triangle, check-circle, check, x, plus, minus.
- **Navigation:** chevron-down/up/left/right, chevrons-left/right (first and last page), arrow-left/right/up/down, external-link, menu, more, home.
- **Actions:** search, zoom-in, filter, sliders, pencil, trash, copy, download, upload, refresh, eye, eye-off, grid, list, grip (a handle to drag in a new order).
- **Commerce:** cart, bag, package, truck, tag, percent, credit-card, heart, star, image.
- **People and time:** user, mail, lock, calendar, clock, bell.

`iconNames` (exported from the package) lists them in code, and `icons` holds the shapes. Ask for a new icon rather than mixing in another set: it must sit on the same 20px grid, 1.5px round stroke, outline only.

## Size

- `sm` 16px — compact controls, table cells, badges, help triggers next to labels.
- `md` 20px (default) — comfortable controls and navigation.
- `lg` 24px — storefront header (cart, account, search) and empty states.
- `control` — follows the density (`--ctl-icon`), for custom controls.
- Inside a Button (its `iconStart` / `iconEnd` or icon slots) or an Input affix the icon fills its slot; the `size` you pass is ignored there.

## Colour

Icons are stroked in the current text colour (`currentColor`): `ink` beside body text, `ink-muted` beside secondary text. Use a status colour only together with a word ("check-circle In stock" in `success`). Never use colour alone to say something.

## Keyboard and screen readers

- Next to text or inside a labelled button: no `label` — the icon gets `aria-hidden="true"`, so nothing is read twice.
- Standing alone and meaningful (a stock status icon in a dense table column): pass `label` ("In stock"), which makes it `role="img"` with that `aria-label`.
- The icon is never focusable (`focusable="false"`), so it adds no tab stop.
- An icon-only button gets its name from the Button's `aria-label`, not from the icon.

## What you provide

- **Required:** `name` (one of `iconNames`). An unknown name renders nothing and warns once in the console with the list of valid names.
- **Optional:** `size` (`sm` | `md` | `lg` | `control`, default `md`), `label` (only for a meaningful icon that stands alone). `class` and `style` pass through to the `<svg>`.
