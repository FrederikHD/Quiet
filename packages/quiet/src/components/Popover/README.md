# Popover

A small panel anchored to a trigger, opened by click or tap: short help text (`kind="tip"`) or a few interactive controls (`kind="dialog"`).

## Two kinds

- **tip** — read-only explanation: help next to a form label ("What is a SKU?"), why a button is disabled, what a fee includes. Focus stays on the trigger; the text is announced to screen readers when it opens. Panel: 13px text, up to 280px wide, `space-3` × `space-4` padding.
- **dialog** (default) — a few controls: change an order's status, pick columns for a table, a quick filter. Focus moves to the first control inside; Escape returns it to the trigger; tabbing out closes the panel. Panel: 15px text, up to 320px wide, `space-4` padding. More than a handful of fields, or anything that needs Save and Cancel with consequences → use a dialog (modal) instead.

## Behaviour

- Opens on **click or tap**, never on hover — hover doesn't exist on touch screens and hover-only help can't be reached by keyboard.
- Closes on Escape, a click outside, or pressing the trigger again. Inside a Dialog it sits above the dialog, and Escape closes it before the dialog.
- Sits below the trigger, `space-2` away; flips above when there's no room and stays 8px inside the viewport. Use `placement="top"` to prefer above and `align` (`start`, `center`, `end`) to line up with the trigger.
- Renders at the end of the page, so it is never clipped by a table, card or scroll container, and follows its trigger on scroll and resize.

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

## What you provide

- The default slot — exactly one trigger element, usually a Button. It receives `aria-expanded`, `aria-controls` and the click that toggles the panel; your own `@click` still runs first (call `preventDefault()` in it to stop the toggle).
- `content` — the panel's contents.
- `label` — names the panel for screen readers ("Help: SKU", "Change order status"). Required; the component warns without it.
- The panel: `content` for text, or the `#content` slot. Optional `kind`, `placement`, `align`, `width`, and `v-model:open` to control it from outside.

A third kind, `menu`, is what Menu builds on: focus moves into the panel like `dialog`, Tab leaves it in one step, and the trigger says `aria-haspopup="menu"`. Use Menu rather than this kind directly.
