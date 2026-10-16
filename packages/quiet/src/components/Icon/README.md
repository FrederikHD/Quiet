# Icon

A single icon from the Quiet set: 53 outline icons drawn on a 20px grid with a 1.5px round stroke, coloured by the surrounding text.

## The set

- **Status and help:** info, help, alert-circle, alert-triangle, check-circle, check, x, plus, minus.
- **Navigation:** chevron-down/up/left/right, chevrons-left/right (first and last page), arrow-left/right, external-link, menu, more, home.
- **Actions:** search, filter, sliders, pencil, trash, copy, download, upload, refresh, eye, eye-off, grid, list.
- **Commerce:** cart, bag, package, truck, tag, percent, credit-card, heart, star, image.
- **People and time:** user, mail, lock, calendar, clock, bell.

`Icon.names` lists them in code. Ask for a new icon rather than mixing in another set: it must sit on the same 20px grid, 1.5px round stroke, outline only.

## Size

- `sm` 16px — compact controls, table cells, badges, help triggers next to labels.
- `md` 20px (default) — comfortable controls and navigation.
- `lg` 24px — storefront header (cart, account, search) and empty states.
- `control` — follows the density (`--ctl-icon`), for custom controls.
- Inside a Button (`iconStart`/`iconEnd`) or an Input affix the icon fills its slot; the `size` you pass is ignored there.

## Colour

Icons take `currentColor`: `ink` beside body text, `ink-muted` beside secondary text. Use a status colour only together with a word ("check-circle In stock" in `success`). Never use colour alone to say something.

## Keyboard and screen readers

- Next to text or inside a labelled button: no `label` — the icon is hidden from screen readers, so nothing is read twice.
- Standing alone and meaningful (a stock status icon in a dense table column): pass `label` ("In stock"), which makes it `role="img"`.
- An icon-only button gets its name from the Button's `aria-label`, not from the icon.

## What you provide

`name`, optionally `size`, `label`, `class`, `style`. An unknown name renders nothing and warns in the console with the list of valid names.
