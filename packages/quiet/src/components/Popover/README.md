# Popover

A small panel anchored to a trigger, opened by click or tap: short help text (`kind="tip"`) or a few interactive controls (`kind="dialog"`).

## Two kinds

- **tip** — read-only explanation: help next to a form label ("What is a SKU?"), why a button is disabled, what a fee includes. Focus stays on the trigger; the text is announced to screen readers when it opens. Panel: 13px text, up to 280px wide, `space-3` × `space-4` padding.
- **dialog** (default) — a few controls: change an order's status, pick columns for a table, a quick filter. Focus moves to the first control inside; Escape returns it to the trigger; tabbing out closes the panel. Panel: 15px text, up to 320px wide, `space-4` padding. More than a handful of fields, or anything that needs Save and Cancel with consequences → use a dialog (modal) instead.

## Behaviour

- Opens on **click or tap**, never on hover — hover doesn't exist on touch screens and hover-only help can't be reached by keyboard.
- Closes on Escape, a click outside, pressing the trigger again, or focus moving elsewhere. It also closes when its trigger scrolls out of view. Inside a Dialog it sits above the dialog, and Escape closes it before the dialog.
- Sits below the trigger, `space-2` (8px) away; flips above when there's no room and stays 8px inside the viewport. Use `placement="top"` to prefer above and `align` (`start` by default, `center`, `end`) to line up with the trigger.
- Renders at the end of the page, so it is never clipped by a table, card or scroll container, and follows its trigger on scroll and resize. A `class` or `style` set on the Popover goes to this panel, as does `panel-class`.
- `width` fixes the panel's width (a number in px, or any CSS length). `flush` removes the panel's padding, for lists that reach the edges.
- A template ref gives `show()`, `hide()` and `toggle()`.

## Look

`surface-raised` with a 1px `line-strong` border and `radius-md` — the system uses borders, not shadows, and `line-strong` keeps the edge visible against `surface` and `surface-raised` alike. Text `ink`. No arrow.

## Help text pattern

Field does this for you when you pass `help`: a `help` icon button (ghost, icon-only, named "Help: <label>") right after the label, opening a tip. Outside a Field, compose it yourself:

```vue
<QPopover kind="tip" label="Help: SKU" content="Your own article number. It appears on packing slips and invoices, not in the shop.">
  <QButton variant="ghost" size="slim" aria-label="Help: SKU" icon-start="help" />
</QPopover>
```

Keep tips to one or two sentences. Never put information that is required to fill in the field only inside a tip — put that in the visible help text. A tip holds text only — no links or buttons, which keyboard and screen-reader users couldn't reach there; the component warns if it finds one. Use `kind="dialog"` for anything interactive.

A third kind, `menu`, is what Menu builds on: focus moves into the panel like `dialog`, Tab leaves it in one step, and the trigger says `aria-haspopup="menu"`. Use Menu rather than this kind directly.

## Keyboard and screen readers

- **Trigger:** gets `aria-expanded` (open or not) and, while open, `aria-controls` pointing at the panel. A `dialog` trigger also says `aria-haspopup="dialog"`; a tip trigger has no `aria-haspopup`. Give an icon-only trigger an `aria-label`.
- **tip:** focus stays on the trigger. The panel is not a dialog; its text is copied into a hidden `status` live region a moment after it opens, so screen readers read it out. Tab away from the trigger closes it.
- **dialog:** the panel is a `role="dialog"` named by `label`. Focus moves to `initial-focus`, else the first control, else the panel itself. Tab moves through the panel as if it sat right after the trigger: Tab on the last control closes it and moves on to whatever follows the trigger; Shift+Tab on the first control closes it and returns to the trigger. Moving focus anywhere else closes it too.
- **Escape** closes the topmost open layer only and puts focus back on the trigger. If the app closes the panel (an action inside it) while focus was inside, focus also goes back to the trigger.

## What you provide

- **Required:** `label` ("Help: SKU", "Change order status") — names a `dialog` panel for screen readers; the component warns without it. The default slot — exactly one trigger element, usually a Button.
- **Optional:** `content` (text for the panel), `kind` (`tip` | `dialog` | `menu`, default `dialog`), `placement` (`bottom` | `top`, default `bottom`), `align` (`start` | `center` | `end`, default `start`), `width` (px number or CSS length; default fits the content up to 320px, 280px for tips), `defaultOpen` (opens on first render), `initialFocus` (dialog kind: the element focused on open), `flush` (no panel padding), `panelClass` (class for the panel).
- **v-model:** `v-model:open` (default false).
- **Slots:** the default slot (the trigger — it receives `aria-expanded`, `aria-controls` and the click that toggles the panel; your own `@click` runs first, and `preventDefault()` in it stops the toggle), `#content` (the panel's contents, in place of `content`).
