# Textarea

Multi-line text in the Input's box: product descriptions, order notes, gift messages, refund reasons. It's the bare control. The label, hint and messages come from Field, as with Input.

## Anatomy

- **Box:** the Input box (`surface-raised`, 1px `line-strong` border, `radius-md`).
- **Text:** 22px lines (24px at `large`), with the control's padding. `rows` (default 4) sets the starting height.
- **Counter** (with `maxlength`): "114 / 500" in the bottom-right corner, 12/16 `ink-muted` with tabular figures. In the last 10% of the limit (at least 10 characters) it changes to "8 characters left" in `warning` and is announced. `maxLength` is a hard stop. `showCount={false}` hides the counter.

## Height

- **Default:** `rows` high, and people can drag the corner to make it taller.
- **`autoGrow`:** grows with the text from `rows` up to `maxRows` (if set), then scrolls. Use it for descriptions and notes, where the text can be any length.

## States

The same as Input. Focus thickens the border to 2px `brand` (or `danger` while invalid). `invalid` gives a `danger` border. `readonly` and `disabled` use the read-only and disabled looks every control shares. Phones get 16px text, so iOS doesn't zoom in.

## Writing it

- The label names the content: "Description", "Note". The hint says where it shows up or who sees it: "Only your team sees notes."
- A placeholder is an example, never the instruction.

## What you provide

- A label, through Field.
- `v-model`.
- **Optional:** `rows`, `auto-grow`, `max-rows`, `maxlength`, `show-count`, `size` (`large`), `invalid`, `disabled`, `readonly`, `name`, `placeholder`.
- **`strings`** for the counter ("noch 8 Zeichen"), or once for the shop with `configure({ strings: { textarea } })`.

The component ref exposes `focus()` and `textarea`; `class` and `style` go on the box.
