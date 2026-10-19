# Textarea

Multi-line text in the Input's box: product descriptions, order notes, gift messages, refund reasons. It's the bare control. The label, hint and messages come from Field, as with Input.

## Anatomy

- **Box:** the Input box (`surface-raised`, 1px `line-strong` border, `radius-md`).
- **Text:** 22px lines (24px at `large`), with the control's padding. `rows` (default 4) sets the starting height.
- **Counter** (with `maxlength`): "114 / 500" in the bottom-right corner, 12/16 `ink-muted` with tabular figures. From 10 characters before the limit (or 10% of it, if that is more) it changes to "8 characters left" in `warning` and is announced. `maxlength` is a hard stop. `:show-count="false"` hides the counter.

## Height

- **Default:** `rows` high, and people can drag the corner to make it taller.
- **`autoGrow`:** grows with the text from `rows` up to `maxRows` (if set), then scrolls. Use it for descriptions and notes, where the text can be any length.

## States

The same as Input. Focus thickens the border to 2px `brand` (or `danger` while invalid). `invalid` gives a `danger` border. `readonly` and `disabled` use the read-only and disabled looks every control shares. Phones get 16px text, so iOS doesn't zoom in.

## Writing it

- The label names the content: "Description", "Note". The hint says where it shows up or who sees it: "Only your team sees notes."
- A placeholder is an example, never the instruction.

## Keyboard and screen readers

- A native `<textarea>`: Enter adds a line, Tab moves on. Read-only textareas stay in the tab order; disabled ones are skipped.
- Named by its Field's label and described by the Field's message and hint, then the counter. `invalid` (or a Field error) sets `aria-invalid`; `required` sets the native `required`, and a required Field adds `aria-required`.
- The counter is silent while there is room. Near the limit it becomes a polite live region, so "8 characters left" is read out as people type.
- A form reset empties `v-model` along with the textarea.

## What you provide

- **Required:** a label, through Field (or `id` with your own `<label for>`, or `aria-label`).
- **Optional:** `rows` (default 4), `autoGrow`, `maxRows` (default no limit), `maxlength`, `showCount` (default true), `size` (`default` | `large`; default `default`), `invalid`, `disabled`, `readonly`, `required`, `id`. `name`, `placeholder` and other attributes go to the native textarea.
- **v-model:** `v-model` (the text).
- **Translations:** `strings` — `count(n, max)` ("114 / 500") and `left(n)` ("8 characters left", "1 character left"); or once for the shop with `configure({ strings: { textarea: { … } } })`.

The component ref exposes `focus()` and `textarea`; `class` and `style` go on the box.
