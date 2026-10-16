# Button

Triggers an action in place; use `secondary` by default and `primary` for the single action the view exists for.

## Variants

- **primary** — `brand` fill, `on-solid` text. At most one per view: Save changes, Add to cart, Checkout, Create order.
- **secondary** (default) — `surface-raised` with a `line-strong` border. Every other action: Cancel, Edit, Export, Print packing slip.
- **ghost** — no fill or border until hover. Low-emphasis actions repeated many times: row actions in tables, toolbar overflow (⋯), Clear filters.
- **danger** — `danger` fill. Destructive, hard-to-undo actions that stand alone: the confirm button of a delete or refund dialog, Cancel order on its own.
- **danger-outline** — `danger` text and border on `surface-raised`. Destructive actions that sit beside ordinary ones: Remove in a cart line, Delete product at the bottom of an edit form, Remove in a table row. It escalates to a confirm dialog whose button is `danger`.

## Size and density

- `size="slim"` is a fixed 28px with 13px text and 8px padding: actions inside table cells, filter bars, beside a heading, dense side panels. Back office and desktop only — below 640px it grows to the density size so it stays tappable. Never slim for a primary action.
- `size="default"` follows the nearest `data-density`: 40px with 15px text in comfortable, 32px with 13px text in compact.
- `size="large"` is a fixed 48px with 16px semibold text: storefront Add to cart and Checkout, and primary actions in mobile sheets. Don't use it in the back office.
- `fullWidth` for the product page Add to cart and buttons in mobile sheets; elsewhere buttons size to their label.

## Icons

- Name an icon in `icon-start` / `icon-end` (`icon-start="plus"`), or put your own SVG in the `#icon-start` / `#icon-end` slots; they are sized to `--ctl-icon` and inherit the text colour. Use a 1.5px stroke outline icon.
- `iconStart` for an object or action (+ Add product); `iconEnd` only for direction (View order →, a menu chevron).
- An icon-only button renders square and **must** have an `aria-label`. Use it only for universally understood actions (⋯ more, ✕ close, trash in a table row); where the icon might not be recognised, use a text button instead. Quiet has no hover tooltips (help opens on click, see Iconography).

## States

- **Hover:** primary and danger darken (`brand-hover`, `danger-hover`); secondary and ghost take `surface-sunken`; danger-outline takes `danger-tint`.
- **Pressed:** while the pointer is down, one step darker again — `brand-active`, `danger-active`, `line` for secondary and ghost.
- **Selected:** set `pressed` to make a secondary or ghost button a toggle (it sets `aria-pressed`). On: `brand-tint` fill, `brand` text and border; hover `brand-tint-hover`. Use for view switches (Grid / List), filter toggles (Show archived) and segmented choices. Put a group of toggles in an element with `role="group"` and an `aria-label`, `space-1` apart. Don't use `pressed` for navigation tabs.
- **Menu open:** set `expanded` on a button that opens a menu or popover (it sets `aria-expanded`); it holds its hover look, and secondary gets an `ink` border, while open. Also pass `aria-haspopup="menu"` and `aria-controls`. Add a chevron as `iconEnd`: Bulk actions ▾, Export ▾.
- **Focus:** 2px `brand` outline, 2px offset, keyboard focus only.
- **Disabled:** `surface-sunken` fill, `line` border and `ink-muted` text — the same as every disabled control. Prefer explaining why nearby over leaving a disabled button unexplained.
- **Loading:** set `loading` while an action is in flight. The label hides but keeps the width, a spinner shows, and the button is disabled with `aria-busy`. Keep the label — "Saving" reads better to screen readers than nothing.

## Writing it

Verb first, sentence case, two or three words: "Add to cart", "Save changes", "Refund order". Never "OK", "Submit" or "Click here". Name the object when the page has several: "Delete product", not "Delete".

**Long labels.** Translations run long — German is about 30% longer than English ("In den Warenkorb", "Änderungen speichern"). A button never grows wider than its container: an ordinary button truncates its label with an ellipsis, and a `fullWidth` button wraps onto a second line instead. Treat truncation as a bug to fix with a shorter label, not a feature — test every label in the longest language you ship.

## Keyboard and screen readers

- An icon-only button needs an `aria-label`; the component warns in the console when it's missing.
- A loading button keeps its label for screen readers and announces busy; it can't be clicked twice.
- A disabled link-button (`href` + `disabled`) can't be focused or clicked and is still announced as a dimmed link.
- Hover colours apply only on devices that can hover, so a tapped button on a phone never stays highlighted.
- In Windows high-contrast mode every button gets a visible border, a selected toggle takes the system highlight colour, and an open menu button gets a thicker border.
- Every size meets the WCAG 2.2 minimum target of 24px; slim (28px) is the smallest and is desktop-only.

## What you provide

- The default slot — the label (omit it for icon-only).
- `@click`, or `type="submit"` inside a form (the default `type` is `button`, so it never submits by accident).
- `href` to render a link that looks like a button — for navigation, not actions.
- Layout: buttons in a group sit `space-2` apart, with the primary on the right in dialogs and forms.
